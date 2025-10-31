import fs from 'fs';
import path from 'path';
import glob from 'glob';
import {parse} from '@babel/parser';
import traverseModule from '@babel/traverse';
const traverse = traverseModule.default;
import * as t from '@babel/types';

const outputFile = path.join(process.cwd(), 'msg/en.json');
const srcGlob = '../../**/*.{js,jsx,ts,tsx}';

function tryGetString(node) {
    if (!node) return null;
    if (t.isStringLiteral(node)) return node.value;
    if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
        return node.quasis.map(q => q.value.cooked).join('');
    }
    return null;
}

function recordMessage(messages, id, def) {
    if (!id?.startsWith('amp.')) return;
    if (!def) return;
    messages[id] = def;
}

function extractFromJSX(attrs, messages) {
    let id, def;
    for (const attr of attrs) {
        if (!t.isJSXAttribute(attr)) continue;
        const name = attr.name?.name;
        const val = attr.value?.expression ?? attr.value;
        const text = tryGetString(val);
        if (name === 'id') id = text;
        if (name === 'defaultMessage') def = text;
    }
    if (id && def) recordMessage(messages, id, def);
}

function extractFromObject(node, messages) {
    if (!t.isObjectExpression(node)) return;
    let id, def;
    for (const prop of node.properties) {
        if (!t.isObjectProperty(prop)) continue;
        const keyName = t.isIdentifier(prop.key) ? prop.key.name : t.isStringLiteral(prop.key) ? prop.key.value : null;
        const val = tryGetString(prop.value);
        if (keyName === 'id') id = val;
        if (keyName === 'defaultMessage') def = val;
    }
    if (id && def) recordMessage(messages, id, def);
}

const files = glob.sync(srcGlob, {absolute: true});
const messages = {};

for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    let ast;
    try {
        ast = parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });
    } catch {
        continue; // skip broken files
    }

    traverse(ast, {
        JSXOpeningElement(path) {
            const name = path.node.name;
            const comp = t.isJSXIdentifier(name) && name.name ? name.name.toLowerCase() : null;
            if (comp && comp.includes('message')) {
                extractFromJSX(path.node.attributes, messages);
            }
        },
        ObjectExpression(path) {
            // Check if this object could be a defineMessages child
            const parent = path.parentPath?.parentPath;
            if (t.isCallExpression(parent?.node) && t.isIdentifier(parent.node.callee, {name: 'defineMessages'})) {
                extractFromObject(path.node, messages);
            } else {
                extractFromObject(path.node, messages);
            }
        }
    });
}

// Merge with existing
let existing = {};
if (fs.existsSync(outputFile)) {
    try {
        existing = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    } catch {
        existing = {};
    }
}

// Combine & sort
const merged = {...existing, ...messages};
const sorted = Object.fromEntries(Object.entries(merged).sort());

// Ensure path and write
fs.mkdirSync(path.dirname(outputFile), {recursive: true});
fs.writeFileSync(outputFile, JSON.stringify(sorted, null, 2));
console.log(`✅ Extracted ${Object.keys(messages).length} new messages to ${outputFile}`);

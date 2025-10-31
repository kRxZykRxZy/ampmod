const fs = require('fs');
const path = require('path');
const tap = require('tap');
const VirtualMachine = require('../../src/virtual-machine');

tap.test('Case-sensitivity tests', async t => {
    t.plan(4);

    for (const compilerEnabled of [false, true]) {
        for (const caseSensitive of [false, true]) {
            await t.test(
                `Case-sensitivity test: ${compilerEnabled ? 'Compiled' : 'Interpreted'}, ${caseSensitive ? 'case-sensitive' : 'vanilla behaviour'}`,
                async t => {
                    t.plan(1);
                    const vm = new VirtualMachine();
                    vm.setRuntimeOptions({caseSensitivity: caseSensitive});
                    vm.setCompilerOptions({enabled: compilerEnabled});
                    const projectData = fs.readFileSync(path.join(__dirname, '../fixtures/amp-case-sensitivity.apz'));
                    await vm.loadProject(projectData);
                    await new Promise(resolve => {
                        vm.runtime.on('SAY', (target, type, text) => {
                            vm.quit();
                            t.equal(text, caseSensitive ? 'casesensitive' : 'caseinsensitive');
                            resolve();
                        });
                        vm.greenFlag();
                        vm.start();
                    });
                }
            );
        }
    }
});

const context = require.context("./blocks", false, /\.json$/);

const twTranslations = {};

context.keys().forEach(key => {
    const locale = key.replace(/^.\//, "").replace(/\.json$/, "");
    twTranslations[locale.toLowerCase()] = context(key);
});

// Reuse `es` translations for `es-419`
if (twTranslations["es"] && twTranslations["es-419"]) {
    Object.assign(twTranslations["es-419"], twTranslations["es"]);
}

export const blockMsg = twTranslations;

import englishBase from "./splash-l10n/en.json";

let translations = {};

const context = require.context("./splash-l10n", false, /\.json$/);

context.keys().forEach(file => {
    const langCode = file.replace("./", "").replace(".json", "");
    const langData = context(file);

    // Merge English base with langData, langData overrides English
    const merged = { ...englishBase, ...langData };

    // Remove duplicates: only keep first occurrence (langData takes priority)
    translations[langCode] = Object.fromEntries(
        Object.entries(merged).filter(
            ([key], index, self) => self.findIndex(([k]) => k === key) === index
        )
    );
});

export default translations;

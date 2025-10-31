export default editorMessages => {
    // Dynamically require all JSON files in ./msg/
    const context = require.context('./msg', false, /\.json$/);

    const twTranslations = {};

    context.keys().forEach(key => {
        // Get the locale name from the filename, e.g., './es.json' -> 'es'
        const locale = key.replace(/^.\//, '').replace(/\.json$/, '');
        twTranslations[locale.toLowerCase()] = context(key);
    });

    for (const locale of Object.keys(editorMessages)) {
        const toMixIn = twTranslations[locale.toLowerCase()];
        if (toMixIn) {
            Object.assign(editorMessages[locale], toMixIn);
        }
    }

    // Reuse `es` translations for `es-419`
    if (editorMessages['es-419'] && twTranslations.es) {
        Object.assign(editorMessages['es-419'], twTranslations.es);
    }
};

import { APP_NAME } from "@ampmod/branding";

// Because there are all brand names, it is unnecessary for them to be translatable.
export default [
    { heading: "Source" },
    { tag: "scratch", intlLabel: "From Scratch" },
    { tag: "tw", intlLabel: "From TurboWarp" },
    { tag: "ampmod", intlLabel: `From ${APP_NAME}` },
    { tag: "localStorage", intlLabel: "Locally saved" },
    "---",
    // Categorize extensions by type.
    // For now leave untranslated
    { heading: "Categories" },
    { tag: "internet", intlLabel: "Internet" },
    { tag: "graphics", intlLabel: "Graphics" },
    { tag: "sound", intlLabel: "Sound" },
    { tag: "math", intlLabel: "Math" },
    { tag: "data", intlLabel: "Data management" },
    { tag: "catexp", intlLabel: "Category expansions" },
    { tag: "hardware", intlLabel: "Hardware" },
];

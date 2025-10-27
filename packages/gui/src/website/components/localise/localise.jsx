import React from "react";
import { detectLocale } from "../../../lib/detect-locale";
import editorLocales from "@turbowarp/scratch-l10n";

// Load all translation JSON files dynamically from the site-translations directory.
const translationContext = require.context(
    "../../site-translations",
    false,
    /\.json$/
);

const translations = {};
translationContext.keys().forEach(key => {
    const locale = key.replace(/^\.\/(.*)\.json$/, "$1");
    translations[locale] = translationContext(key);
});

const supportedLocales = Object.keys(translations);

// for detecting RTL
const rtlLanguages = ["ar", "he", "fa", "ur"];

// Utility to handle strings/components interpolation
const interpolate = (text, values) => {
    const parts = [text];
    Object.keys(values).forEach(key => {
        const rawVal = values[key];
        const val = React.isValidElement(rawVal)
            ? rawVal
            : typeof rawVal === "function"
              ? React.createElement(rawVal)
              : rawVal;
        const regex = new RegExp(`{${key}}`, "g");
        let newParts = [];
        parts.forEach(part => {
            if (typeof part === "string") {
                const split = part.split(regex);
                split.forEach((chunk, i) => {
                    newParts.push(chunk);
                    if (i < split.length - 1) newParts.push(val);
                });
            } else {
                newParts.push(part);
            }
        });
        parts.splice(0, parts.length, ...newParts);
    });
    return parts;
};

const getTranslation = (id, values = {}) => {
    const locale = detectLocale(supportedLocales);
    const localeTranslations = translations[locale] || translations.en;
    let translationObject = localeTranslations[id];
    if (!translationObject) {
        translationObject = translations.en[id];
    }
    const text = translationObject || id;
    return interpolate(text, values);
};

export const Localise = ({ id, values = {} }) => {
    const parts = getTranslation(id, values);
    return (
        <>
            {parts.map((part, i) =>
                React.isValidElement(part)
                    ? React.cloneElement(part, { key: i })
                    : part
            )}
        </>
    );
};

export const localise = (id, values = {}) => {
    const parts = getTranslation(id, values);

    return parts
        .map(part => (typeof part === "string" ? part : String(part)))
        .join("");
};

export const setHtmlLang = () => {
    const locale = detectLocale(Object.keys(editorLocales)) || "en";

    document.documentElement.lang = locale;

    const langPrefix = locale.split("-")[0];
    document.documentElement.dir = rtlLanguages.includes(langPrefix)
        ? "rtl"
        : "ltr";
};

export default Localise;

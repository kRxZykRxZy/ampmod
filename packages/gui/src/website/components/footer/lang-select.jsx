import React, { useState, useEffect } from "react";
import { lsNamespace } from "../../../lib/amp-localstorage-namespace";
import locales from "@turbowarp/scratch-l10n";

const LANGUAGE_KEY = `${lsNamespace}language`;

// Browser API for readable language names
let languageNames;
if (typeof Intl !== "undefined" && Intl.DisplayNames) {
    languageNames = new Intl.DisplayNames([navigator.language], {
        type: "language",
    });
}

const LanguageSelect = () => {
    const [currentLocale, setCurrentLocale] = useState("en");

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LANGUAGE_KEY);
            if (stored && originalLocales[stored]) setCurrentLocale(stored);
            else if (navigator) {
                const browserLocale = navigator.language.split("-")[0];
                setCurrentLocale(
                    originalLocales[browserLocale] ? browserLocale : "en"
                );
            }
        } catch {
            setCurrentLocale("en");
        }
    }, []);

    const handleChange = e => {
        const newLocale = e.target.value;
        try {
            localStorage.setItem(LANGUAGE_KEY, newLocale);
        } catch {}
        window.location.reload(); // refresh all Localise components
    };

    return (
        <select
            value={currentLocale}
            onChange={handleChange}
            aria-label="Select language"
        >
            {Object.keys(locales).map(locale => (
                <option key={locale} value={locale}>
                    {languageNames ? locales[locale].name : locale}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelect;

import React, { useState, useEffect } from "react";
import { lsNamespace } from "../../../lib/amp-localstorage-namespace";
import locales from "@turbowarp/scratch-l10n";

const LANGUAGE_KEY = `${lsNamespace}language`;

const LanguageSelect = () => {
    const [currentLocale, setCurrentLocale] = useState("en");

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LANGUAGE_KEY);
            if (stored && locales[stored]) setCurrentLocale(stored);
            else if (navigator) {
                const browserLocale = navigator.language.split("-")[0];
                setCurrentLocale(locales[browserLocale] ? browserLocale : "en");
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
                    {locales[locale].name || locale}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelect;

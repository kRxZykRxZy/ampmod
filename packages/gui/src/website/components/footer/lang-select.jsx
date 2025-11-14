import React, { useState, useEffect, useRef } from "react";
import lsNamespace from "../../../lib/amp-localstorage-namespace";
import locales from "@turbowarp/scratch-l10n";
import styles from "./footer.css";

const LANGUAGE_KEY = `${lsNamespace}language`;

const LanguageSelect = () => {
    const [currentLocale, setCurrentLocale] = useState('en');
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();
    const selectedItemRef = useRef();

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LANGUAGE_KEY);
            if (stored && locales[stored]) setCurrentLocale(stored);
            else if (navigator) {
                const browserLocale = navigator.language.split('-')[0];
                setCurrentLocale(locales[browserLocale] ? browserLocale : 'en');
            }
        } catch {
            setCurrentLocale('en');
        }
    }, []);

    const handleSelect = locale => {
        setCurrentLocale(locale);
        setOpen(false);
        try {
            localStorage.setItem(LANGUAGE_KEY, locale);
        } catch {}
        window.location.reload();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll to selected language when dropdown opens
    useEffect(() => {
        if (open && selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ block: 'center', inline: 'nearest' });
        }
    }, [open]);

    return (
        <div className={styles.customDropdown} ref={dropdownRef}>
            <button
                className={styles.dropdownToggle}
                onClick={() => setOpen(prev => !prev)}
                aria-label="Select language"
            >
                {locales[currentLocale]?.name || currentLocale}
            </button>
            {open && (
                <ul className={styles.dropdownMenu}>
                    {Object.keys(locales).map(locale => (
                        <li
                            key={locale}
                            ref={locale === currentLocale ? selectedItemRef : null}
                            className={`${styles.dropdownItem} ${
                                locale === currentLocale ? styles.dropdownItemSelected : ''
                            }`}
                            onClick={() => handleSelect(locale)}
                        >
                            {locales[locale].name || locale}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LanguageSelect;

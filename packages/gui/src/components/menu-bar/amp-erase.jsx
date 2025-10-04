import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { MenuItem } from "../menu/menu.jsx";
import { GUI_DARK, GUI_LIGHT, Theme } from "../../lib/themes/index.js";
import { closeSettingsMenu } from "../../reducers/menus.js";
import { setTheme } from "../../reducers/theme.js";
import { persistTheme } from "../../lib/themes/themePersistance.js";
import errorIcon from "./tw-error.svg";
import styles from "./settings-menu.css";

const eraseData = async () => {
    if (
        confirm(
            // eslint-disable-next-line max-len
            "This will irreversably reset all your local data, including the Restore Points and backpack. Are you sure you want to continue?\n\nIf a project is currently open, save it before continuing. Erasing data will reload the page."
        )
    ) {
        const prefix = process.env.ampmod_is_canary ? "canary:" : "amp:";
        const keysToRemove = Object.keys(localStorage).filter(key =>
            key.startsWith(prefix)
        );
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
        // We have to manually delete the databases due to Firefox not supporting indexedDB.databases(). WHYYYY???
        indexedDB.deleteDatabase(
            process.env.ampmod_is_canary
                ? " Canary_RestorePoints"
                : "Amp_RestorePoints"
        );
        indexedDB.deleteDatabase(
            process.env.ampmod_is_canary
                ? " Canary_RestorePoints"
                : "Amp_RestorePoints"
        );
        window.onbeforeunload = null;
        location.reload();
    }
};

const EraseButton = () => (
    <MenuItem>
        <div
            className={styles.option}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={eraseData}
        >
            <img
                src={errorIcon}
                draggable={false}
                width={24}
                height={24}
                className={styles.icon}
            />
            <div className={styles.menuItemTitleAndSubtitle}>
                <div className={styles.submenuLabel}>
                    <FormattedMessage
                        defaultMessage="Build the ark"
                        description="Button to erase all data"
                        id="amp.menuBar.erase"
                    />
                </div>
                <div className={styles.menuItemSubtitle}>
                    <FormattedMessage
                        defaultMessage="Think twice before doing this!"
                        description="Subtitle of the button to erase all data"
                        id="amp.menuBar.erase.subtitle"
                    />
                </div>
            </div>
        </div>
    </MenuItem>
);

export default EraseButton;

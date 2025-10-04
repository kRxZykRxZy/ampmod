import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import { MenuItem } from "../menu/menu.jsx";
import { GUI_DARK, GUI_LIGHT, Theme } from "../../lib/themes/index.js";
import { closeSettingsMenu } from "../../reducers/menus.js";
import { setTheme } from "../../reducers/theme.js";
import { persistTheme } from "../../lib/themes/themePersistance.js";
import styles from "./settings-menu.css";
import { notScratchDesktop } from "../../lib/isScratchDesktop.js";

let showPwaButton = false;
let deferredPrompt;
window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    showPwaButton = true;
});

const handleClickPwaInstall = addonId => {
    deferredPrompt.prompt();
};

const GuiThemeMenu = () => {
    if (showPwaButton && notScratchDesktop) {
        return (
            <MenuItem>
                <div
                    className={styles.option}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={handleClickPwaInstall}
                >
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Install app (beta)"
                            description="Button to install the AmpMod Progressive Web App."
                            id="amp.installPwa"
                        />
                    </span>
                </div>
            </MenuItem>
        );
    } else {
        return null;
    }
};

GuiThemeMenu.propTypes = {
    onChangeTheme: PropTypes.func,
    theme: PropTypes.instanceOf(Theme),
};

const mapStateToProps = state => ({
    theme: state.scratchGui.theme.theme,
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(GuiThemeMenu);

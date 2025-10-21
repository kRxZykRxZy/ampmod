import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage, defineMessages } from "react-intl";
import { connect } from "react-redux";

import check from "./check.svg";
import dropdownCaret from "./dropdown-caret.svg";
import { MenuItem, Submenu } from "../menu/menu.jsx";
import {
    GUI_MAP,
    GUI_AMP_LIGHT,
    GUI_LIGHT,
    GUI_DARK,
    GUI_AMOLED,
    GUI_HIGH_CONTRAST,
    Theme,
    GUI_CUSTOM,
} from "../../lib/themes/index.js";
import { closeSettingsMenu } from "../../reducers/menus.js";
import { setTheme } from "../../reducers/theme.js";
import { persistTheme } from "../../lib/themes/themePersistance.js";
import lightModeIcon from "./tw-sun.svg";
import darkModeIcon from "./tw-moon.svg";
import {
    openGuiThemeMenu,
    guiThemeMenuOpen,
    closeGuiThemeMenu,
} from "../../reducers/menus.js";
import styles from "./settings-menu.css";

const options = defineMessages({
    [GUI_AMP_LIGHT]: {
        defaultMessage: "Light",
        description: "Light theme option",
        id: "amp.gui.light",
    },
    [GUI_LIGHT]: {
        defaultMessage: "Light (Classic)",
        description: "Light theme option",
        id: "amp.gui.lightClassic",
    },
    [GUI_DARK]: {
        defaultMessage: "Dark",
        description: "Dark theme option",
        id: "amp.gui.dark",
    },
    [GUI_AMOLED]: {
        defaultMessage: "AMOLED (Beta)",
        description: "AMOLED theme option with true black",
        id: "amp.gui.amoled",
    },
    [GUI_HIGH_CONTRAST]: {
        defaultMessage: "High Contrast (Alpha)",
        description: "High contrast theme option",
        id: "amp.gui.highContrast",
    },
    [GUI_CUSTOM]: {
        defaultMessage: "Customize in Addon Settings",
        description:
            "Link in block color list to open addon settings for more customization",
        id: "tw.blockColors.custom",
    },
});

const icons = {
    [GUI_LIGHT]: lightModeIcon,
    [GUI_DARK]: darkModeIcon,
    [GUI_AMOLED]: darkModeIcon,
    [GUI_HIGH_CONTRAST]: darkModeIcon,
};

const GuiIcon = ({ id }) => (
    <>
        <div
            className={styles.guiThemeIconOuter}
            style={{
                backgroundColor:
                    GUI_MAP[id].guiColors["ui-primary"] ||
                    GUI_MAP["light"].guiColors["ui-primary"],
            }}
        >
            <div
                className={`${styles.guiThemeIconMenubar} ${!GUI_MAP[id].guiColors["menu-bar-background"] && styles.noCustomMenuBar}`}
                style={{
                    borderBottomColor:
                        GUI_MAP[id].guiColors["high-contrast-border"] ||
                        "transparent",
                    backgroundColor:
                        GUI_MAP[id].guiColors["menu-bar-background"] ||
                        GUI_MAP["light"].guiColors["menu-bar-background"],
                }}
            />
            <div
                className={styles.guiThemeIconFakeBlocks}
                style={{
                    borderColor: GUI_MAP[id].guiColors["ui-black-transparent"],
                    backgroundColor:
                        GUI_MAP[id].blockColors["workspace"] || "#fff",
                }}
            />
        </div>
    </>
);

GuiIcon.propTypes = {
    id: PropTypes.string,
};

const GuiThemeItem = ({ id, isSelected, onClick }) => (
    <MenuItem onClick={onClick}>
        <div className={styles.option}>
            <img
                className={classNames(styles.check, {
                    [styles.selected]: isSelected,
                })}
                width={15}
                height={12}
                src={check}
                draggable={false}
            />
            <GuiIcon id={id} />
            <FormattedMessage {...options[id]} />
        </div>
    </MenuItem>
);

GuiThemeItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
};

const GuiThemeMenu = ({ isOpen, isRtl, onChangeTheme, onOpen, theme }) => (
    <MenuItem expanded={isOpen}>
        <div className={styles.option} onClick={onOpen}>
            <GuiIcon id={theme.gui} />
            <div className={styles.menuItemTitleAndSubtitle}>
                <span className={styles.submenuLabel}>
                    <FormattedMessage
                        defaultMessage="Theme"
                        description="Label for menu to choose GUI theme (light, dark, AMOLED)"
                        id="amp.menuBar.guiTheme"
                    />
                </span>
                <span className={styles.menuItemSubtitle}>
                    <FormattedMessage {...options[theme.gui]} />
                </span>
            </div>
            <img
                className={styles.expandCaret}
                src={dropdownCaret}
                draggable={false}
            />
        </div>
        <Submenu place={isRtl ? "left" : "right"}>
            {[
                GUI_AMP_LIGHT,
                GUI_LIGHT,
                GUI_DARK,
                GUI_AMOLED,
                GUI_HIGH_CONTRAST,
            ].map(id => (
                <GuiThemeItem
                    key={id}
                    id={id}
                    isSelected={theme.gui === id}
                    onClick={() => onChangeTheme(theme.set("gui", id))}
                />
            ))}
        </Submenu>
    </MenuItem>
);

GuiThemeMenu.propTypes = {
    theme: PropTypes.instanceOf(Theme),
    isRtl: PropTypes.bool,
    onOpen: PropTypes.func,
    onChangeTheme: PropTypes.func,
};

const mapStateToProps = state => ({
    isOpen: guiThemeMenuOpen(state),
    theme: state.scratchGui.theme.theme,
    isRtl: state.locales.isRtl,
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
    onOpen: () => dispatch(openGuiThemeMenu()),
});

export default connect(mapStateToProps, mapDispatchToProps)(GuiThemeMenu);

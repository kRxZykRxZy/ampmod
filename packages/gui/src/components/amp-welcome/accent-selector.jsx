import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { FormattedMessage, defineMessages } from "react-intl";
import { connect } from "react-redux";

import check from "../menu-bar/check.svg";
import {
    ACCENT_GREEN,
    ACCENT_GREY,
    ACCENT_BLUE,
    ACCENT_MAP,
    ACCENT_PURPLE,
    ACCENT_RED,
    ACCENT_RAINBOW,
    Theme,
} from "../../lib/themes/index.js";
import { closeSettingsMenu } from "../../reducers/menus.js";
import { setTheme } from "../../reducers/theme.js";
import { persistTheme } from "../../lib/themes/themePersistance.js";
import styles from "./welcome.css";

import rainbowIcon from "../menu-bar/tw-accent-rainbow.svg";

const options = defineMessages({
    [ACCENT_GREEN]: {
        defaultMessage: "Green",
        description:
            "Name of the green color scheme, used by UltiBlocks by default.",
        id: "tw.accent.green",
    },
    [ACCENT_RED]: {
        defaultMessage: "Red",
        description:
            "Name of the red color scheme, used by TurboWarp by default.",
        id: "tw.accent.red",
    },
    [ACCENT_PURPLE]: {
        defaultMessage: "Purple",
        description: "Name of the purple color scheme. Matches modern Scratch.",
        id: "tw.accent.purple",
    },
    [ACCENT_BLUE]: {
        defaultMessage: "Blue",
        description:
            "Name of the blue color scheme. Matches Scratch before the high contrast update.",
        id: "tw.accent.blue",
    },
    [ACCENT_GREY]: {
        defaultMessage: "Grey",
        description:
            "Name of the grey color scheme. Matches the header of TurboWarp in dark mode.",
        id: "tw.accent.grey",
    },
    [ACCENT_RAINBOW]: {
        defaultMessage: "Rainbow",
        description: "Name of color scheme that uses a rainbow.",
        id: "tw.accent.rainbow",
    },
});

const icons = {
    [ACCENT_RAINBOW]: rainbowIcon,
};

const ColorIcon = props => (
    <div
        className={styles.accentSelectorIconOuter}
        style={{
            background:
                props.id === "green"
                    ? ACCENT_MAP[props.id].guiColors["looks-secondary"]
                    : ACCENT_MAP[props.id].guiColors[
                          "menu-bar-background-image-classic"
                      ] || ACCENT_MAP[props.id].guiColors["looks-secondary"],
        }}
    />
);

ColorIcon.propTypes = {
    id: PropTypes.string,
};

const AccentMenuItem = props => (
    <button
        type="button"
        className={styles.themeSelectorButton}
        aria-pressed={props.isSelected}
        onClick={props.onClick}
    >
        <ColorIcon id={props.id} />
    </button>
);

AccentMenuItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
};

const AccentSelector = ({ theme, onChangeTheme }) => {
    // Hide accent selector if high-contrast theme is active
    if (theme.gui === "high-contrast") {
        return null;
    }
    return (
        <div className={styles.themeSelectorRow}>
            {Object.keys(options).map(id => (
                <AccentMenuItem
                    key={id}
                    id={id}
                    isSelected={theme.accent === id}
                    onClick={() => onChangeTheme(theme.set("accent", id))}
                />
            ))}
        </div>
    );
};

AccentSelector.propTypes = {
    theme: PropTypes.instanceOf(Theme),
    onChangeTheme: PropTypes.func,
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

export default connect(mapStateToProps, mapDispatchToProps)(AccentSelector);

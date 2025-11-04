import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import { lazy } from 'react';
import {MenuItem} from '../menu/menu.jsx';
import {GUI_DARK, GUI_LIGHT, Theme} from '../../lib/themes/index.js';
import {closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import addonsIcon from './addons.svg';
import styles from './settings-menu.css';
import {lazyLoad} from "../../lib/amp-lazy-launch.jsx";

const handleClickAddonSettings = addonId => {
    if (process.env.ampmod_mode === "standalone") {
        const url = new URL(window.location.href);
        url.searchParams.set('addon-settings', '');

        if (typeof addonId === 'string' && addonId.length > 0) {
            url.hash = `#${addonId}`;
        } else {
            url.hash = '';
        }

        window.open(url.toString(), '_blank');
        return;
    }
    // addonId might be a string of the addon to focus on, undefined, or an event (treat like undefined)
    const path = process.env.ROUTING_STYLE === 'wildcard' ? 'addons' : 'addons.html';
    const url = `${process.env.ROOT}${path}${typeof addonId === 'string' ? `#${addonId}` : ''}`;
    window.open(url);
};

const GuiThemeMenu = ({onChangeTheme, theme}) => (
    <MenuItem>
        <div
            className={styles.option}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={handleClickAddonSettings}
        >
            <img src={addonsIcon} draggable={false} width={24} height={24} className={styles.icon} />
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="Addons"
                    description="Button to open addon settings"
                    id="tw.menuBar.addons"
                />
            </span>
        </div>
    </MenuItem>
);

GuiThemeMenu.propTypes = {
    onChangeTheme: PropTypes.func,
    theme: PropTypes.instanceOf(Theme)
};

const mapStateToProps = state => ({
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(GuiThemeMenu);

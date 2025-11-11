import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import {MenuItem} from '../menu/menu.jsx';
import {GUI_DARK, GUI_LIGHT, Theme} from '../../lib/themes/index.js';
import {closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import addonsIcon from './addons.svg';
import styles from './settings-menu.css';

const handleClickAddonSettings = () => {
    if (process.env.ampmod_mode === "standalone") {
        const url = new URL(window.location.href);
        url.searchParams.set('addon-settings', '');
        url.hash = '';

        window.open(url.toString(), '_blank');
        return;
    }
    const path = process.env.ROUTING_STYLE === 'wildcard' ? 'addons' : 'addons.html';
    const url = `${process.env.ROOT}${path}`;
    window.open(url);
};

const GuiThemeMenu = ({}) => (
    <MenuItem>
        <div
            className={styles.option}
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

const mapStateToProps = (state: { scratchGui: { theme: { theme: any; }; }; }) => ({
    theme: state.scratchGui.theme.theme
});

const mapDispatchToProps = (dispatch: (arg0: { type: string; theme?: any; menu?: any; }) => void) => ({
    onChangeTheme: (theme: Theme) => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(GuiThemeMenu);

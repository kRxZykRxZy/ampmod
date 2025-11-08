import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import {MenuItem} from '../menu/menu.jsx';
import {closeSettingsMenu} from '../../reducers/menus.js';
import styles from './settings-menu.css';
import {notScratchDesktop} from '../../lib/isScratchDesktop.js';

let showPwaButton = false;
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showPwaButton = true;
});

const handleClickPwaInstall = addonId => {
    deferredPrompt.prompt();
};

const InstallPWAButton = () => {
    if (showPwaButton && notScratchDesktop) {
        return (
            <MenuItem>
                <div
                    className={styles.option}
                     
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

export default InstallPWAButton;

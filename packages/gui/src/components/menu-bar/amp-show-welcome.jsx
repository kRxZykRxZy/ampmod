import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';

import {MenuItem} from '../menu/menu.jsx';
import {openWelcomeModal} from '../../reducers/modals';
import styles from './settings-menu.css';
import {notScratchDesktop} from '../../lib/isScratchDesktop.js';

const ShowWelcomeMessageButton = () => {
    if (notScratchDesktop) {
        return (
            <MenuItem>
                <div
                    className={styles.option}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={openWelcomeModal}
                >
                    <span className={styles.submenuLabel}>
                        <FormattedMessage
                            defaultMessage="Show welcome message"
                            description="Button to show the welcome message."
                            id="amp.showWelcomeMessage"
                        />
                    </span>
                </div>
            </MenuItem>
        );
    } else {
        return null;
    }
};

export default ShowWelcomeMessageButton;

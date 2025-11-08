import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import styles from './framerate-indicator.css';

const FramerateIndicator = ({framerate, interpolation}) => (
    <React.Fragment>
        {framerate !== 30 && framerate !== 0 && (
            <div className={styles.framerateContainer}>
                <div className={styles.framerateLabel}>
                    <FormattedMessage
                        defaultMessage="{framerate} FPS"
                        description="Label to indicate custom framerate"
                        id="tw.fps"
                        values={{
                            framerate: framerate
                        }}
                    />
                </div>
            </div>
        )}
        { // amp: special behaviour for framerate 0
            framerate === 0 && (
                <div className={styles.framerateContainer}>
                    <div className={styles.framerateLabel}>
                        <FormattedMessage
                            defaultMessage="Uncapped FPS"
                            description="Label to indicate that the framerate is not capped, i.e. running at screen refresh rate"
                            id="amp.uncappedFPS"
                        />
                    </div>
                </div>
        )}
        {interpolation && (
            <div className={styles.framerateContainer}>
                <div className={styles.framerateLabel}>
                    <FormattedMessage
                        defaultMessage="Interpolation"
                        description="Label to indicate interpolation is enabled"
                        id="tw.interpolationEnabled"
                    />
                </div>
            </div>
        )}
    </React.Fragment>
);

FramerateIndicator.propTypes = {
    framerate: PropTypes.number,
    interpolation: PropTypes.bool
};

export default FramerateIndicator;

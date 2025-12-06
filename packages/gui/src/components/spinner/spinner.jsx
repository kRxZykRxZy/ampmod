import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';

import styles from './spinner.css';

const SpinnerComponent = function (props) {
    const {className, level, small, large} = props;

    const [isMotionReduced, setIsMotionReduced] = useState(false);

    useEffect(() => {
        setIsMotionReduced(!document.documentElement.classList.contains('amp-gui-animations-enabled'));
    }, []);

    if (isMotionReduced) {
        return <div className={classNames(className, styles.loadingText)}>Loading...</div>;
    }

    return (
        <div
            className={classNames(className, styles.spinner, styles[level], {
                [styles.small]: small,
                [styles.large]: large
            })}
        />
    );
};

// PropTypes and defaultProps remain the same
SpinnerComponent.propTypes = {
    className: PropTypes.string,
    large: PropTypes.bool,
    level: PropTypes.string,
    small: PropTypes.bool
};
SpinnerComponent.defaultProps = {
    className: '',
    large: false,
    level: 'info',
    small: false
};

export default SpinnerComponent;

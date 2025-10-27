import classNames from "classnames";
import PropTypes from "prop-types";

import pauseIcon from "./pause.svg";
import playIcon from "./play.svg";
import styles from "../green-flag/green-flag.css";

const PauseComponent = function (props) {
    const { paused, className, onClick, title, ...componentProps } = props;
    return (
        <img
            className={classNames(
                className,
                styles.greenFlag,
                // For Scratch Addons compatibility
                "pause-btn"
            )}
            draggable={false}
            src={paused ? playIcon : pauseIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};
PauseComponent.propTypes = {
    paused: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};
PauseComponent.defaultProps = {
    paused: false,
    title: "Pause",
};
export default PauseComponent;

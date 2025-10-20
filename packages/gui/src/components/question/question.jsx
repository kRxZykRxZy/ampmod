import PropTypes from "prop-types";
import React from "react";
import styles from "./question.css";
import Input from "../forms/input.jsx";
import enterIcon from "./icon--enter.svg";
import noIcon from "../close-button/icon--close.svg";

const QuestionComponent = props => {
    const {
        answer,
        className,
        question,
        onChange,
        onClick,
        onKeyPress,
        onYes,
        onNo,
        type = "text",
    } = props;

    const renderInput = () => {
        switch (type) {
            case "number":
                return (
                    <Input
                        autoFocus
                        value={answer}
                        onChange={onChange}
                        onKeyPress={onKeyPress}
                    />
                );
            case "yesno":
                return (
                    <div className={styles.yesNoButtons}>
                        <button
                            type="button"
                            className={`${styles.yesNoButton} ${answer === "yes" ? styles.selected : ""}`}
                            onClick={onYes}
                        >
                            <img
                                className={styles.yesIcon}
                                src={enterIcon}
                                alt="Yes"
                                draggable={false}
                            />
                            Yes
                        </button>
                        <button
                            type="button"
                            className={`${styles.yesNoButton} ${answer === "no" ? styles.selected : ""}`}
                            onClick={onNo}
                        >
                            <img
                                className={styles.noIcon}
                                src={noIcon}
                                alt="No"
                                draggable={false}
                            />
                            No
                        </button>
                    </div>
                );
            case "text":
            default:
                return (
                    <Input
                        type="text"
                        autoFocus
                        value={answer}
                        onChange={onChange}
                        onKeyPress={onKeyPress}
                    />
                );
        }
    };

    return (
        <div className={className}>
            <div className={styles.questionContainer}>
                {question && (
                    <div className={styles.questionLabel}>{question}</div>
                )}
                <div className={styles.questionInput}>
                    {renderInput()}
                    {type !== "yesno" && (
                        <button
                            className={styles.questionSubmitButton}
                            onClick={onClick}
                        >
                            <img
                                className={styles.questionSubmitButtonIcon}
                                draggable={false}
                                src={enterIcon}
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

QuestionComponent.propTypes = {
    answer: PropTypes.string,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    question: PropTypes.string,
    type: PropTypes.oneOf(["text", "number", "yesno"]),
};

export default QuestionComponent;

import "../import-first";
import React, { useState } from "react";
import styles from "./examples.css";
import homeStyles from "../home/home.css";
import Box from "../../components/box/box.jsx";
import Modal from "../../components/modal/modal.jsx";
import Button from "../../components/button/button.jsx";
import { APP_NAME } from "@ampmod/branding";

const ExampleModal = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.title}
        onRequestClose={props.onCancel}
        id="exampleModal"
    >
        <Box className={styles.modalBody}>
            <div>{props.description || "No description."}</div>
            <div>{`Project created by ${props.by || "AmpMod developers"}.`}</div>
            <div
                className={homeStyles.button}
                style={{ minWidth: 0 }}
                onClick={props.onClickOpen}
            >
                Open
            </div>
        </Box>
    </Modal>
);

const Example = props => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={styles.example} onClick={() => setIsOpen(true)}>
                <img
                    className={styles.exampleThumbnail}
                    src={props.img}
                    draggable={false}
                />
                <div className={styles.exampleContent}>
                    <div className={styles.exampleTitle}>{props.title}</div>
                    {props.by && (
                        <div className={styles.exampleAuthor}>
                            by {props.by}
                        </div>
                    )}
                </div>
            </div>

            {isOpen && (
                <ExampleModal {...props} onCancel={() => setIsOpen(false)} />
            )}
        </>
    );
};

export default Example;

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
            <div
                className={homeStyles.button}
                style={{ minWidth: 0 }}
                onClick={props.onButtonClick}
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
                <img className={styles.exampleThumbnail} src={props.img} />
                <div className={styles.exampleTitle}>{props.title}</div>
            </div>

            {isOpen && (
                <ExampleModal
                    title={props.title}
                    description={props.description}
                    onCancel={() => setIsOpen(false)}
                    onButtonClick={props.onClick}
                />
            )}
        </>
    );
};

export default Example;

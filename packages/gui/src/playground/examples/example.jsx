import "../import-first";
import React, { useState } from "react";
import styles from "./examples.css";
import Box from "../../components/box/box.jsx";
import Modal from "../../components/modal/modal.jsx";
import Button from "../../components/button/button.jsx";

const ExampleModal = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.title}
        onRequestClose={props.onCancel}
        id="exampleModal"
    >
        <Box className={styles.modalBody}>
            <Box className={styles.modalLabel}>Example</Box>
            <Button onClick={props.onButtonClick}>Click me</Button>
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
                    onCancel={() => setIsOpen(false)}
                    onButtonClick={() => {
                        alert("LOL");
                    }}
                />
            )}
        </>
    );
};

export default Example;

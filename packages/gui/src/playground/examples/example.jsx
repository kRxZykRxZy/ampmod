import "../import-first";
import React, { useState } from "react";
import styles from "./examples.css";
import homeStyles from "../home/home.css";
import Box from "../../components/box/box.jsx";
import Modal from "../../components/modal/modal.jsx";
import Button from "../../components/button/button.jsx";
import { APP_NAME } from "@ampmod/branding";

import examples from "../../lib/default-project/examples/index.js";

const ExampleModal = props => {
    const getDownloadLink = () => {
        const buffer = examples[props.id];
        if (!buffer) return null;

        const blob = new Blob([buffer], { type: "application/x.scratch.sb3" });
        const url = URL.createObjectURL(blob);
        return { url, filename: `${props.id}.apz` };
    };

    const downloadLink = getDownloadLink();

    return (
        <Modal
            className={styles.modalContent}
            contentLabel={props.title}
            onRequestClose={props.onCancel}
            id="exampleModal"
        >
            <Box className={styles.modalBody}>
                <div>{props.description || "No description."}</div>
                <iframe
                    src={`embed.html?example=${props.id}&use-user-theme`}
                    width="386"
                    height="330"
                    allowtransparency="true"
                    frameborder="0"
                    scrolling="no"
                    allowfullscreen=""
                    style={{ colorScheme: "auto", borderRadius: "8px" }}
                ></iframe>
                <div>{`Project created by ${props.by || "AmpMod developers"}.`}</div>
                <div className={homeStyles.buttonRow}>
                    <div
                        className={homeStyles.button}
                        onClick={() => {
                            location.href = `editor.html?example=${props.id}`;
                        }}
                    >
                        Open
                    </div>
                    {downloadLink && (
                        <a
                            className={homeStyles.button}
                            href={downloadLink.url}
                            download={downloadLink.filename}
                        >
                            Download .apz
                        </a>
                    )}
                </div>
            </Box>
        </Modal>
    );
};

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

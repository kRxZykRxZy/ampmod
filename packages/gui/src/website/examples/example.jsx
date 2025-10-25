import "../../playground/import-first.js";
import React, { useState } from "react";
import styles from "./examples.css";
import homeStyles from "../home/home.css";
import Box from "../../components/box/box.jsx";
import Modal from "../../components/modal/modal.jsx";

import examples from "../../lib/examples/index.js";

const ExampleModal = props => {
    const [downloadLink, setDownloadLink] = useState(null);

    React.useEffect(() => {
        const fetchDownloadLink = async (id, title) => {
            try {
                const module = await examples[id](); // fetch module
                if (!module) return;

                // unwrap default export if exists
                const buffer = module.default || module;

                // ensure it's ArrayBuffer / Uint8Array
                if (
                    !(
                        buffer instanceof ArrayBuffer ||
                        buffer instanceof Uint8Array
                    )
                ) {
                    console.error("Invalid buffer type for download:", buffer);
                    return;
                }

                const blob = new Blob([buffer], {
                    type: "application/x.scratch.sb3",
                });
                const url = URL.createObjectURL(blob);
                setDownloadLink({ url, filename: `${title}.apz` });
            } catch (err) {
                console.error("Failed to fetch download link:", err);
            }
        };
        fetchDownloadLink(props.id, props.title);
    }, [props.id, props.title]);

    return (
        <Modal
            className={styles.modalContent}
            contentLabel={props.title}
            onRequestClose={props.onCancel}
            id="exampleModal"
        >
            <Box className={styles.modalBody}>
                <div>{props.description || "No description."}</div>
                {!props.isSupported && (
                    <div className={styles.unsupported}>
                        This project is not supported on your browser or system.
                        It, or parts of it, may not work. The description may
                        provide more context.
                    </div>
                )}
                <iframe
                    src={`embed.html?example=${props.id}&use-user-theme`}
                    width="386"
                    height="330"
                    allowtransparency="true"
                    frameBorder="0"
                    scrolling="no"
                    allowFullScreen=""
                    style={{ colorScheme: "auto", borderRadius: "8px" }}
                />
                <div>{`Project created by ${props.by || "AmpMod developers"}.`}</div>
                <div className={homeStyles.buttonRow}>
                    <a
                        className={homeStyles.button}
                        href={`editor.html?example=${props.id}`}
                    >
                        Open
                    </a>
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

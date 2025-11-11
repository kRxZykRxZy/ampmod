import '../../playground/import-first.js';
import { useState, useEffect } from 'react';
import styles from './examples.css';
import homeStyles from '../home/home.css';
import Box from '../../components/box/box.jsx';
import Modal from '../../components/modal/modal.jsx';

import examples from '../../lib/examples';
import Localise, { localise } from '../components/localise/localise.jsx';

import { APP_NAME } from '@ampmod/branding';

type ExampleID = keyof typeof examples; // e.g., "griffpatch" | "battery"
type DownloadLink = { url: string; filename: string } | null;

interface ExampleModalProps {
  id: ExampleID;
  onCancel?: () => void;
  isSupported: boolean;
  by?: string;
}

interface ExampleProps {
  img?: string;
  id: ExampleID;
  by?: string;
}

const ExampleModal: React.FC<ExampleModalProps> = (props) => {
    const [downloadLink, setDownloadLink] = useState<DownloadLink>(null);

    useEffect(() => {
        const fetchDownloadLink = async (id: ExampleID, title: string) => {
            try {
                const module = await examples[id](); // fetch module
                if (!module) return;

                // unwrap default export if exists
                const buffer = module.default || module;

                // ensure it's ArrayBuffer / Uint8Array
                if (!(buffer instanceof ArrayBuffer || buffer instanceof Uint8Array)) {
                    console.error('Invalid buffer type for download:', buffer);
                    return;
                }

                // @ts-ignore
                const blob = new Blob([buffer], {
                    type: 'application/x.scratch.sb3'
                });
                const url = URL.createObjectURL(blob);
                setDownloadLink({url, filename: `${title}.apz`});
            } catch (err) {
                console.error('Failed to fetch download link:', err);
            }
        };
        fetchDownloadLink(props.id, localise(`examples.apz.${props.id}`));
    }, [props.id]);

    return (
        <Modal
            className={styles.modalContent}
            contentLabel={localise(`examples.apz.${props.id}`)}
            onRequestClose={props.onCancel}
        >
            <Box className={styles.modalBody}>
                <Localise id={`examples.apz.${props.id}.description`} values={{APP_NAME}} />
                {!props.isSupported && (
                    <div className={styles.unsupported}>
                        <Localise id={'examples.unsupported'} />
                    </div>
                )}
                <iframe
                    src={`embed.html?example=${props.id}&use-user-theme`}
                    width="386"
                    height="330"
                    allowTransparency
                    allowFullScreen
                    style={{colorScheme: 'auto', borderRadius: '8px', border: "none"}}
                />
                <div>{`Project created by ${props.by || 'AmpMod developers'}.`}</div>
                <div className={homeStyles.buttonRow}>
                    <a className={homeStyles.button} href={`editor.html?example=${props.id}`}>
                        <Localise id="examples.open" />
                    </a>
                    {downloadLink && (
                        <a className={homeStyles.button} href={downloadLink.url} download={downloadLink.filename}>
                            <Localise id="examples.download" />
                        </a>
                    )}
                </div>
            </Box>
        </Modal>
    );
};

const Example: React.FC<ExampleProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={styles.example} onClick={() => setIsOpen(true)}>
                <img className={styles.exampleThumbnail} src={props.img} draggable={false} />
                <div className={styles.exampleContent}>
                    <div className={styles.exampleTitle}>
                        <Localise id={`examples.apz.${props.id}`} />
                    </div>
                    {props.by && (
                        <div className={styles.exampleAuthor}>
                            <Localise id="examples.by" values={{creator: props.by}} />
                        </div>
                    )}
                </div>
            </div>

            {isOpen && <ExampleModal {...props} onCancel={() => setIsOpen(false)} isSupported={true} />}
        </>
    );
};

export default Example;

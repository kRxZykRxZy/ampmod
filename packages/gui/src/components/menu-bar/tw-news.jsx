import React from 'react';
import {APP_NAME} from '@ampmod/branding';
import {isScratchDesktop} from '../../lib/isScratchDesktop';
import CloseButton from '../close-button/close-button.jsx';
import styles from './tw-news.css';

const LOCAL_STORAGE_KEY = `${process.env.ampmod_mode === 'canary' ? 'canary' : 'amp'}:closedNews`;
const NEWS_ID = 'privacy-1';

const getIsClosedInLocalStorage = () => {
    try {
        return localStorage.getItem(LOCAL_STORAGE_KEY) === NEWS_ID;
    } catch (e) {
        return false;
    }
};

const markAsClosedInLocalStorage = () => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, NEWS_ID);
    } catch (e) {
        // ignore
    }
};

class TWNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closed: getIsClosedInLocalStorage()
        };
        this.handleClose = this.handleClose.bind(this);
    }
    handleClose() {
        markAsClosedInLocalStorage();
        this.setState(
            {
                closed: true
            },
            () => {
                window.dispatchEvent(new Event('resize'));
            }
        );
    }
    render() {
        const today = new Date();
        const is911 = today.getMonth() === 8 && today.getDate() === 11; // September is month 8 (0-indexed)
        if (true || this.state.closed || isScratchDesktop() || is911 || process.env.ampmod_mode === 'lab') {
            return null;
        }
        return (
            <div className={styles.news}>
                <div className={styles.text}>
                    { }
                    {`The ${APP_NAME} privacy policy has been updated. You can also disable analytics. `}
                    <a href="privacy.html" target="_blank" rel="noreferrer">
                        {'View it here.'}
                    </a>
                </div>
                <CloseButton className={styles.close} onClick={this.handleClose} />
            </div>
        );
    }
}

export default TWNews;

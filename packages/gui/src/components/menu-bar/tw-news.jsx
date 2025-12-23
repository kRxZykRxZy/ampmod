import React from 'react';
import {APP_NAME} from '@ampmod/branding';
import {isScratchDesktop} from '../../lib/isScratchDesktop';
import CloseButton from '../close-button/close-button.jsx';
import styles from './tw-news.css';

const LOCAL_STORAGE_KEY = `${process.env.ampmod_mode === 'canary' ? 'canary' : 'amp'}:closedNews`;
const NEWS_ID = '50st-mirror-is-too-old';

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
        if (/*true ||*/ this.state.closed || isScratchDesktop() || is911 || process.env.ampmod_mode === 'lab') {
            return null;
        }
        return (
            <div className={styles.news}>
                <div className={styles.text}>
                    { }
                    {`The mirror at 50-scratch-tabs.github.io/AmpMirror runs AmpMod 0.2.0 from March 2025. It is now ${new Date().toLocaleString('en-GB', { month: 'long' })} ${new Date().getFullYear()}, and this site is running AmpMod ${process.env.ampmod_version}. Using the aformentioned mirror results in boosting SEO of a severely outdated version of AmpMod, so please avoid it. `}
                    <a href="https://ampmod.codeberg.page/manual/ampmirror">Learn more.</a>
                </div>
                <CloseButton className={styles.close} onClick={this.handleClose} />
            </div>
        );
    }
}

export default TWNews;

import {useEffect, useState} from 'react';
import styles from '../../design.sss';
import myStyles from './hero.css';
import WelcomeBanner from '../../../components/amp-welcome/welcome-banner.svg';
import * as Bowser from 'bowser';
import Localise from '../localise/localise';

export default () => {
    const [isPhone, setIsPhone] = useState(false);

    useEffect(() => {
        const parsed = Bowser.parse(window.navigator.userAgent);
        const platformType = parsed.platform.type;
        setIsPhone(platformType === 'mobile');
    }, []);

    return (
        <header className={styles.headerContainer}>
            <div className={myStyles.headerContainerContainer}>
                <div className={myStyles.headerContent}>
                    <h1 className={styles.headerText}>
                        <Localise id="appSlogan" />
                    </h1>

                    {process.env.ampmod_mode === 'canary' && (
                        <>
                            <strong>
                                <Localise id="hero.canaryWarning" />
                            </strong>
                        </>
                    )}

                    <div className={styles.spacing}></div>
                    <div className={myStyles.buttonRow}>
                        {!isPhone && (
                            <a href="editor.html" className={myStyles.primaryButton}>
                                <Localise id="hero.create" />
                            </a>
                        )}
                        <a href="examples.html" className={myStyles.primaryButton}>
                            <Localise id="hero.examples" />
                        </a>
                    </div>
                    <div className={styles.spacing}></div>
                </div>

                <div className={myStyles.headerImage}>
                    <img src={WelcomeBanner} alt="Welcome Banner" />
                </div>
            </div>
        </header>
    );
};

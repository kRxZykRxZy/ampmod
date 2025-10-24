import React, { useEffect, useState } from "react";
import styles from "../../info.css";
import myStyles from "./hero.css";
import { APP_SLOGAN } from "@ampmod/branding";
import WelcomeBanner from "../../../components/amp-welcome/welcome-banner.svg";
import * as Bowser from "bowser";

export const Hero = () => {
    const [isPhone, setIsPhone] = useState(false);

    useEffect(() => {
        const parsed = Bowser.parse(window.navigator.userAgent);
        const platformType = parsed.platform.type;
        setIsPhone(platformType === "mobile");
    }, []);

    return (
        <header className={styles.headerContainer}>
            <div className={myStyles.headerContainerContainer}>
                <div className={myStyles.headerContent}>
                    <h1 className={styles.headerText}>{APP_SLOGAN}</h1>
                    {process.env.ampmod_mode === "canary" && (
                        <>
                            <p className={styles.wrap}>
                                <strong>
                                    This is a canary build. Bugs may be present,
                                    and your projects may break when the final
                                    version is released. You should not use this
                                    version for creating non-test projects.
                                </strong>
                            </p>
                            <div className={styles.spacing}></div>
                        </>
                    )}
                    <div className={styles.spacing}></div>
                    <div className={myStyles.buttonRow}>
                        {!isPhone && (
                            <a
                                href="editor.html"
                                className={myStyles.primaryButton}
                            >
                                Try it out
                            </a>
                        )}
                        <a
                            href="examples.html"
                            className={myStyles.primaryButton}
                        >
                            See examples
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

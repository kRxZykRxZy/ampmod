import React from "react";
import styles from "../../info.css";
import myStyles from "./hero.css";
import { APP_SLOGAN } from "@ampmod/branding";
import WelcomeBanner from "../../../components/amp-welcome/welcome-banner.svg";

export const Hero = () => (
    <header className={styles.headerContainer}>
        <div className={myStyles.headerContainerContainer}>
            <div className={myStyles.headerContent}>
                <h1 className={styles.headerText}>{APP_SLOGAN}</h1>
                {process.env.ampmod_mode === "canary" && (
                    <>
                        <p className={styles.wrap}>
                            <strong>
                                This is a canary build. Bugs may be present, and
                                your projects may break when the final version
                                is released. You should not use this version for
                                creating non-test projects.
                            </strong>
                        </p>
                        <div className={styles.spacing}></div>
                    </>
                )}
                <div className={styles.spacing}></div>
                <div className={myStyles.buttonRow}>
                    <a href="editor.html" className={myStyles.primaryButton}>
                        Try it out
                    </a>
                    <a href="examples.html" className={myStyles.primaryButton}>
                        See examples
                    </a>
                </div>
                <div className={styles.spacing}></div>
            </div>

            <div className={myStyles.headerImage}>
                <img src={WelcomeBanner}></img>
            </div>
        </div>
    </header>
);

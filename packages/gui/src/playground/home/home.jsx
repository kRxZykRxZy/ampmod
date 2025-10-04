import "../import-first";
import React from "react";
import render from "../app-target";
import styles from "../info.css";
import homeStyles from "./home.css";
import * as bowser from "bowser";

import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from "@ampmod/branding";
import { applyGuiColors } from "../../lib/themes/guiHelpers";
import { detectTheme } from "../../lib/themes/themePersistance";

import Header from "../../components/amp-header/header.jsx";
import Footer from "../../components/amp-footer/footer.jsx";
import Clippy from "../../containers/amp-clippy.jsx";

/* eslint-disable react/jsx-no-literals */

applyGuiColors(detectTheme());
document.documentElement.lang = "en";

const Home = () => (
    <>
        <Header />
        <Clippy isFixed messageSet="website" />
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                {APP_NAME}{" "}
                {process.env.ampmod_is_canary
                    ? " (canary build)"
                    : `- ${APP_SLOGAN}`}
            </h1>
            {process.env.ampmod_is_canary && (
                <>
                    <p className={styles.wrap}>
                        <strong>
                            This is a canary build. Bugs may be present, and
                            your projects may break when the final version is
                            released. You should not use this version for
                            creating non-test projects.
                        </strong>
                    </p>
                    <div className={styles.spacing}></div>
                </>
            )}
            <p className={styles.wrap}>{APP_DESCRIPTION}</p>
            <div className={styles.spacing}></div>
            <a href="editor.html" className={homeStyles.primaryButton}>
                Try {APP_NAME} now!
            </a>
            <div className={styles.spacing}></div>
        </header>
        {/* <section>
            <div className={homeStyles.notification}>
                <h2>Contribute to AmpMod!</h2>
                <p>
                    AmpMod is an open-source project. You can contribute to the project by visiting our Codeberg repository.
                    Even if you don't know JavaScript, your help is appreciated!
                </p>
            </div>
        </section> */}
        <main className={homeStyles.main}>
            {/* START: Main two-column layout wrapper */}
            <div className={homeStyles.mainContentGrid}>
                {/* LEFT COLUMN: Contains the introductory sections */}
                <div className={homeStyles.leftColumn}>
                    <section>
                        <h2>What is {APP_NAME}?</h2>
                        <p>
                            {APP_NAME} is a powerful block-based programming
                            language, built on Scratch 3.0 and TurboWarp. It can
                            be used for many things, from simple throwaway
                            spaghetti scripts to large-scale calculations.
                        </p>
                    </section>
                    <section>
                        <h2>It's not just Scratch, it's {APP_NAME}!</h2>
                        <p>
                            {APP_NAME} is designed to be a convenient package of
                            features to make complex projects easily. From
                            clicker games to scientific experiments, we have it
                            all.
                        </p>
                    </section>
                    <section>
                        <h2>{APP_NAME} is licenced under the GPL v3</h2>
                        <a href="LICENSE.txt" className={homeStyles.button}>
                            View the licence
                        </a>
                    </section>
                    <section>
                        <h2>Need help?</h2>
                        {/* If you are modifying AmpMod, you should replace or remove these links */}
                        <a
                            href="https://ampmod.flarum.cloud"
                            className={`${homeStyles.button} ${homeStyles.marginRight}`}
                        >
                            Visit the forums
                        </a>
                        <a
                            href="https://ultiblocks.miraheze.org/wiki/Main_Page"
                            className={homeStyles.button}
                        >
                            Visit the wiki
                        </a>
                    </section>
                </div>

                {/* RIGHT COLUMN: Contains the Features section */}
                <div className={homeStyles.rightColumn}>
                    <section>
                        <h2>Features</h2>
                        {/* Inner 2-column grid for the features list */}
                        <div className={homeStyles.twoColumnGrid}>
                            <div className={homeStyles.columnItem}>
                                <h3>For programmers</h3>
                                <ul>
                                    <li>
                                        {APP_NAME} compiles projects to
                                        JavaScript to make them run faster than
                                        in vanilla Scratch.
                                    </li>
                                    <li>
                                        With arrays, you can create complex list
                                        structures and store them as variables.
                                    </li>
                                    <li>
                                        {APP_NAME} adds over 100 new unsandboxed
                                        extensions to Scratch, opening access to
                                        various browser features.
                                    </li>
                                </ul>
                            </div>
                            <div className={homeStyles.columnItem}>
                                <h3>For artists and animators</h3>
                                <ul>
                                    <li>
                                        {APP_NAME} features new fonts like Comic
                                        and Amplification to use in your
                                        costumes and backdrops.
                                    </li>
                                    <li>
                                        Creating a rounded rectangle has never
                                        been easier with the Rounded Rectangle
                                        tool.
                                    </li>
                                    <li>
                                        Custom fonts can be loaded from system
                                        font name or a font file.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    </>
);

render(<Home />);

import "../import-first.js";
import React from "react";
import render from "../../playground/app-target.js";

// This page diverges significantly from other pages and thus uses its own independent styles altogether.
// design.css is only used for the hero in a separate component.
import styles from "./home.css";

import { APP_FORUMS, APP_NAME, APP_WIKI } from "@ampmod/branding";
import { applyGuiColors } from "../../lib/themes/guiHelpers.js";
import { detectTheme } from "../../lib/themes/themePersistance.js";
import Header from "../components/header/header.jsx";
import Footer from "../components/footer/footer.jsx";
import Clippy from "../../containers/amp-clippy.jsx";

import { Hero } from "../components/hero/hero.jsx";

/* eslint-disable react/jsx-no-literals */

applyGuiColors(detectTheme());
document.documentElement.lang = "en";

const Home = () => (
    <>
        <Header />
        <Clippy isFixed messageSet="website" />
        <Hero />
        <main className={styles.main}>
            {/* START: Main two-column layout wrapper */}
            <div className={styles.mainContentGrid}>
                {/* LEFT COLUMN: Contains the introductory sections */}
                <div className={styles.leftColumn}>
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
                        <h2>Need help?</h2>
                        {/* If you are modifying AmpMod, you should replace or remove these links */}
                        <div className={styles.buttonRow}>
                            <a href={APP_FORUMS} className={styles.button}>
                                Visit the forums
                            </a>
                            <a href={APP_WIKI} className={styles.button}>
                                Visit the wiki
                            </a>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN: Contains the Features section */}
                <div className={styles.rightColumn}>
                    <section>
                        <h2>Features</h2>
                        {/* Inner 2-column grid for the features list */}
                        <div className={styles.twoColumnGrid}>
                            <div className={styles.columnItem}>
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
                            <div className={styles.columnItem}>
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

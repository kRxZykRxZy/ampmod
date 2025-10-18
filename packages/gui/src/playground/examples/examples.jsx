import "../import-first";
import React from "react";
import render from "../app-target";
import styles from "../info.css";
import myStyles from "./examples.css";
import * as bowser from "bowser";

import { APP_NAME } from "@ampmod/branding";
import { applyGuiColors } from "../../lib/themes/guiHelpers";
import { detectTheme } from "../../lib/themes/themePersistance";

import Header from "../../components/amp-header/header.jsx";
import Footer from "../../components/amp-footer/footer.jsx";
import Example from "./example.jsx";
import Loader from "../../components/loader/loader.jsx";
import { lazyLaunch } from "../../lib/amp-lazy-launch.jsx";

import Box2DIcon from "./images/box2dlogo.png";

/* eslint-disable react/jsx-no-literals */

applyGuiColors(detectTheme());
document.documentElement.lang = "en";

const ExamplesPage = () => (
    <>
        <Header />
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>Examples</h1>
            <p className={styles.headerText}>
                Click an example to learn more about it. Then, click "Open" to
                open it and experiment with {APP_NAME}!
            </p>
        </header>
        <main className={styles.main}>
            <section>
                <p>
                    {/* "AmpMod" is intentionally hardcoded here */}
                    These examples are licenced under a{" "}
                    <a href="https://creativecommons.org/licenses/by/4.0/deed.en">
                        Creative Commons Attribution 4.0
                    </a>{" "}
                    licence. Therefore, if you distribute these examples on
                    another website, you must provide credit to the AmpMod
                    developers.
                </p>
                <div className={myStyles.examplesRow}>
                    <Example
                        title={"Box2D Demos"}
                        img={Box2DIcon}
                        description={`${APP_NAME}'s Box2D extension allows you to add 2D physics to your games! (Based off a sample from extensions.turbowarp.org.)`}
                        onClick={() => {
                            location.href = "editor.html?example=box2d";
                        }}
                    />
                </div>
            </section>
        </main>
        <Footer />
    </>
);

render(<ExamplesPage />);

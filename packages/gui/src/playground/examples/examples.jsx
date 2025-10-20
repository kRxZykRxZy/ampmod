import "../import-first";
import React from "react";
import render from "../app-target";
import styles from "../info.css";
import myStyles from "./examples.css";

import { APP_NAME } from "@ampmod/branding";
import { applyGuiColors } from "../../lib/themes/guiHelpers";
import { detectTheme } from "../../lib/themes/themePersistance";

import Header from "../../components/amp-header/header.jsx";
import Footer from "../../components/amp-footer/footer.jsx";
import Example from "./example.jsx";
import projects from "./projects.js";

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
                <div className={myStyles.examplesRow}>
                    {projects.map(proj => (
                        <Example
                            key={proj.id}
                            id={proj.id}
                            title={proj.title}
                            by={proj.by}
                            img={proj.img}
                            description={proj.description}
                            isSupported={proj.isSupported ?? true}
                        />
                    ))}
                </div>
            </section>
            <section>
                <p>
                    <small>
                        These examples are licenced under a{" "}
                        <a href="https://creativecommons.org/licenses/by/4.0/deed.en">
                            Creative Commons Attribution 4.0
                        </a>{" "}
                        licence. Therefore, if you distribute these examples on
                        another website, you must provide credit to the creator.{" "}
                        <a href="https://codeberg.org/ampmod/ampmod/src/branch/develop/packages/gui/src/playground/examples/images/README.md">
                            Image atrribution...
                        </a>
                    </small>
                </p>
            </section>
        </main>
        <Footer />
    </>
);

render(<ExamplesPage />);

import "../import-first.js";
import React from "react";
import render from "../../playground/app-target.js";
import styles from "../design.css";
import myStyles from "./examples.css";

import { APP_NAME } from "@ampmod/branding";
import { applyGuiColors } from "../../lib/themes/guiHelpers.js";
import { detectTheme } from "../../lib/themes/themePersistance.js";

import Header from "../components/header/header.jsx";
import Footer from "../components/footer/footer.jsx";
import Example from "./example.jsx";
import projects from "./projects.js";
import Localise, {
    localise,
    setHtmlLang,
} from "../components/localise/localise.jsx";

applyGuiColors(detectTheme());
setHtmlLang();
document.title = `${localise("examples.title")} - ${APP_NAME}`;

// Exported so it works with desktop
export const ExamplesPage = () => (
    <>
        <Header />
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                <Localise id="examples.title" />
            </h1>
            <p className={styles.headerText}>
                <Localise id="examples.introduction" values={{ APP_NAME }} />
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
                        <Localise
                            id="examples.licenceText"
                            values={{
                                ccLink: (
                                    <a href="https://creativecommons.org/licenses/by/4.0/deed.en">
                                        <Localise id="examples.licence.cc" />
                                    </a>
                                ),
                                imageAttribution: (
                                    <a href="https://codeberg.org/ampmod/ampmod/src/branch/develop/packages/gui/src/playground/examples/images/README.md">
                                        <Localise id="examples.licence.images" />
                                    </a>
                                ),
                            }}
                        />
                    </small>
                </p>
            </section>
        </main>
        <Footer />
    </>
);

render(<ExamplesPage />);

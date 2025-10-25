import "../import-first";
import React from "react";
import PropTypes from "prop-types";
import render from "../../playground/app-target.js";
import styles from "../design.css";
import myStyles from "./credits.css";

import { APP_NAME } from "@ampmod/branding";
import { applyGuiColors } from "../../lib/themes/guiHelpers";
import { detectTheme } from "../../lib/themes/themePersistance";
import UserData from "./users";

import Header from "../components/header/header.jsx";
import Footer from "../components/footer/footer.jsx";

import appleCat from "./apple-cat-pleased.svg";

/* eslint-disable react/jsx-no-literals */

applyGuiColors(detectTheme());
document.documentElement.lang = "en";

const totalContributors =
    (UserData.contributors?.length || 0) +
    (UserData.addonDevelopers?.length || 0) +
    (UserData.extensionDevelopers?.length || 0) +
    (UserData.tw?.length || 0);

const User = ({ image, text, href, role }) => (
    <a href={href} target="_blank" rel="noreferrer" className={myStyles.user}>
        <img
            loading="lazy"
            className={myStyles.userImage}
            src={image}
            width="60"
            height="60"
        />
        <div className={myStyles.userInfo}>{text}</div>
        {role && <div className={myStyles.userRole}>{role}</div>}
    </a>
);
User.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    href: PropTypes.string,
};

const UserList = ({ users }) => (
    <div className={myStyles.users}>
        {users.map((data, index) => (
            <User key={index} {...data} />
        ))}
    </div>
);
UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object),
};

const Credits = () => (
    <>
        <Header />
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>{APP_NAME} Credits</h1>
            <p className={styles.wrap}>
                There are {totalContributors} contributors to {APP_NAME} in
                total, and this is growing!
            </p>
            <div className={styles.spacing}></div>
        </header>
        <main className={styles.main}>
            <section>
                <p>
                    <i>
                        Individual contributors are listed in no particular
                        order. The order is randomized each visit. Users who
                        only made very minor contributions are not included.
                    </i>
                </p>
            </section>
            <section>
                <h2>Contributors</h2>
                <UserList users={UserData.contributors} />
            </section>
            <section>
                <h2>Addons</h2>
                <UserList users={UserData.addonDevelopers} />
            </section>
            <section>
                <h2>TurboWarp Extension Gallery</h2>
                <UserList users={UserData.extensionDevelopers} />
            </section>
            <section>
                <h2>Example Projects</h2>
                <p>
                    You can find information about who created an example on the
                    page for that example.
                </p>
            </section>
            {/* Please don't remove this. Be nice! */}
            {APP_NAME !== "AmpMod" && (
                <section>
                    <h2>AmpMod</h2>
                    <p>
                        {APP_NAME} is based on the work of the{" "}
                        <a href="https://ampmod.codeberg.page/credits.html">
                            AmpMod contributors
                        </a>{" "}
                        but is not endorsed by AmpMod in any way.
                    </p>
                </section>
            )}
            <section>
                <h2>TurboWarp</h2>
                <p>
                    {APP_NAME} is based on the work of the{" "}
                    <a href="https://turbowarp.org/credits.html">
                        TurboWarp contributors
                    </a>{" "}
                    but is not endorsed by TurboWarp in any way.
                </p>
                <UserList users={UserData.tw} />
            </section>
            <section>
                <h2>Scratch</h2>
                <p>
                    {APP_NAME} is based on the work of the{" "}
                    <a href="https://scratch.mit.edu/credits">
                        Scratch contributors
                    </a>{" "}
                    but is not endorsed by Scratch in any way.
                </p>
                <p>
                    <a href="https://scratch.mit.edu/donate">
                        Donate to support TurboWarp and Scratch.
                    </a>
                </p>
            </section>
            <section>
                <h2>Other Scratch Mods</h2>
                <p>
                    {APP_NAME} uses code from other open-source Scratch
                    modifications but is not endorsed by any them in any way.
                </p>
                <details>
                    <summary>Modifications AmpMod is based on</summary>
                    <ul>
                        <li>
                            <a href="https://librekitten.org">LibreKitten</a>{" "}
                            (home page header)
                        </li>
                    </ul>
                </details>
            </section>
            <section>
                <h2>Favicon</h2>
                <p>
                    The AmpMod favicon is based off an emoji from the{" "}
                    <a href="https://gh.vercte.net/forumoji/">Forumoji</a>{" "}
                    project by{" "}
                    <a href="https://https://scratch.mit.edu/users/lolecksdeehaha/">
                        lolecksdeehaha
                    </a>
                    .
                </p>
            </section>
            <section>
                <h2>Translators</h2>
                <p>
                    Unfortunately, AmpMod's only three developers only speak
                    English. We are working on a way for you to translate
                    AmpMod. While we set it up, you can register an account on{" "}
                    <a href="https://translate.codeberg.org/">
                        Codeberg Weblate
                    </a>{" "}
                    and stay tuned.
                </p>
            </section>
            <section>
                <h2>Fonts</h2>
                <p>
                    The AmpMod logo uses the{" "}
                    <a href="https://fonts.google.com/specimen/Pixelify+Sans">
                        Pixelify Sans
                    </a>{" "}
                    font. It is licenced under the{" "}
                    <a href="https://fonts.google.com/specimen/Pixelify+Sans/license">
                        SIL Open Font License
                    </a>
                    .
                </p>
                <p>
                    Pixelify Sans is also available in the editor as the
                    "Amplification" font.
                </p>
            </section>
            <section>
                <h2>Art</h2>
                <p>
                    Some images use content from{" "}
                    <a href="https://openclipart.org">Openclipart</a>, licensed
                    under the CC0 license. Even though the images are public
                    domain, we would still like to attribute.
                </p>
            </section>
            <Footer />
        </main>
    </>
);

render(<Credits />);

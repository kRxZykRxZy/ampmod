import classNames from "classnames";
import React from "react";
import Logo from "../../../components/menu-bar/tw-advanced.svg";
import FakeLogo from "./lampmod.svg";
import CanaryLogo from "../../../components/menu-bar/ampmod-canary.svg";

import styles from "./header.css";

import TWNews from "../../../components/menu-bar/tw-news.jsx";

function isAprilFools() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    return month === 3 && day === 1;
}

const Header = () => {
    const showFakeLogo = isAprilFools();

    return (
        <React.Fragment>
            <div className={styles.header}>
                <div className={styles.mainGroup}>
                    <a
                        href="/"
                        className={classNames(
                            styles.headerItem,
                            styles.ampmodLogo
                        )}
                    >
                        <img
                            height="26px"
                            src={
                                process.env.ampmod_mode === "canary"
                                    ? CanaryLogo
                                    : showFakeLogo
                                      ? FakeLogo
                                      : Logo
                            }
                            alt={
                                showFakeLogo &&
                                !process.env.ampmod_mode === "canary"
                                    ? "LampMod Logo"
                                    : "AmpMod Logo"
                            }
                        />
                    </a>
                    <a
                        href="editor.html"
                        className={classNames(
                            styles.headerItem,
                            styles.hoverable
                        )}
                    >
                        Create
                    </a>
                    <a
                        href="examples.html"
                        className={classNames(
                            styles.headerItem,
                            styles.hoverable
                        )}
                    >
                        Examples
                    </a>
                    <a
                        href="https://ampmod.codeberg.page/manual"
                        className={classNames(
                            styles.headerItem,
                            styles.hoverable
                        )}
                    >
                        Manual
                    </a>
                    <a
                        href="https://ampmod.codeberg.page/extensions"
                        className={classNames(
                            styles.headerItem,
                            styles.hoverable
                        )}
                    >
                        Extensions
                    </a>
                </div>
            </div>
            <div className={styles.spacer}></div>
            <TWNews />
        </React.Fragment>
    );
};

export default Header;

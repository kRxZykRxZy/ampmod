import classNames from "classnames";
import React from "react";
import Logo from "../../../components/menu-bar/tw-advanced.svg";
import FakeLogo from "./lampmod.svg";
import CanaryLogo from "../../../components/menu-bar/ampmod-canary.svg";
import styles from "./header.css";
import TWNews from "../../../components/menu-bar/tw-news.jsx";
import Localise from "../localise/localise.jsx";

// Determine if today is April Fools’ Day
function isAprilFools() {
    const now = new Date();
    return now.getMonth() === 3 && now.getDate() === 1;
}

const Header = () => {
    const showFakeLogo = isAprilFools();

    const logoSrc =
        process.env.ampmod_mode === "canary"
            ? CanaryLogo
            : showFakeLogo
              ? FakeLogo
              : Logo;

    const logoAlt =
        showFakeLogo && process.env.ampmod_mode !== "canary"
            ? "LampMod Logo"
            : "AmpMod Logo";

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
                        aria-label={logoAlt}
                    >
                        <img height={26} src={logoSrc} alt={logoAlt} />
                    </a>

                    <a
                        href="editor.html"
                        className={classNames(
                            styles.headerItem,
                            styles.hoverable
                        )}
                    >
                        <Localise id="header.create" />
                    </a>

                    <a
                        href="examples.html"
                        className={classNames(
                            styles.headerItem,
                            styles.hoverable
                        )}
                    >
                        <Localise id="examples.title" />
                    </a>

                    <a
                        href="https://ampmod.codeberg.page/manual"
                        className={classNames(
                            styles.headerItem,
                            styles.hoverable
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Localise id="header.manual" />
                    </a>

                    <a
                        href="https://ampmod.codeberg.page/extensions"
                        className={classNames(
                            styles.headerItem,
                            styles.hoverable
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Localise id="header.extensions" />
                    </a>
                </div>
            </div>

            <div className={styles.spacer}></div>
            <TWNews />
        </React.Fragment>
    );
};

export default Header;

/*!
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import {
    APP_BLOG,
    APP_FORUMS,
    APP_NAME,
    APP_SOURCE,
    APP_WIKI,
} from "@ampmod/branding";
import { FormattedMessage } from "react-intl";

import styles from "./footer.css";

const Footer = () => {
    const isAprilFools = () => {
        const now = new Date();
        return now.getMonth() === 3 && now.getDate() === 1; // Month is 0-indexed (0 for January, 3 for April)
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerText}>
                    <FormattedMessage
                        defaultMessage="© {year} {APP_NAME} developers. {APP_NAME} is {freeSoftware}."
                        description="Copyright text noting AmpMod's licence."
                        id="amp.footer.copyright"
                        values={{
                            APP_NAME,
                            year: new Date().getFullYear(),
                            freeSoftware: (
                                <a href="LICENSE.txt">
                                    <FormattedMessage
                                        defaultMessage="free and open-source software"
                                        description="Link saying 'free and open-source software' in amp.footer.copyright"
                                        id="amp.footer.copyright.freeSoftware"
                                    />
                                </a>
                            ),
                        }}
                    />
                </div>
                <div className={styles.footerText}>
                    <FormattedMessage
                        // eslint-disable-next-line max-len
                        defaultMessage="{APP_NAME} is not affiliated with {scratchLink} or {twLink}. Support Scratch by {supportScratch}."
                        description="Disclaimer that AmpMod is not connected to Scratch"
                        id="amp.footer.disclaimer"
                        values={{
                            APP_NAME,
                            scratchLink: (
                                <a
                                    href="https://scratch.mit.edu"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {"Scratch"}
                                </a>
                            ),
                            twLink: (
                                <a
                                    href="https://turbowarp.org"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {"TurboWarp"}
                                </a>
                            ),
                            supportScratch: (
                                <a href="https://scratchfoundation.org/donate">
                                    <FormattedMessage
                                        defaultMessage="donating to the Scratch Foundation"
                                        description="Link to donate to the Scratch Foundation"
                                        id="amp.footer.disclaimer.supportScratch"
                                    />
                                </a>
                            ),
                        }}
                    />
                </div>
                <div className={styles.footerColumns}>
                    <div className={styles.footerSection}>
                        <h3>About</h3>
                        <a href="https://ampmod.netlify.app/faq">
                            <FormattedMessage
                                defaultMessage="AmpMod FAQ"
                                description="FAQ link in footer"
                                id="tw.footer.faq"
                            />
                        </a>
                        {APP_BLOG && (
                            <a href={APP_BLOG}>
                                <FormattedMessage
                                    defaultMessage="AmpMod Blog"
                                    description="Blog link in footer"
                                    id="tw.footer.blog"
                                />
                            </a>
                        )}
                    </div>
                    <div className={styles.footerSection}>
                        <h3>Community</h3>
                        {APP_FORUMS && (
                            <>
                                <a href="https://scratch.mit.edu/discuss/topic/806311/">
                                    <FormattedMessage
                                        defaultMessage="{APP_NAME} on Scratch"
                                        description="Button to give feedback on Scratch in the menu bar"
                                        id="amp.onScratch"
                                        values={{
                                            APP_NAME,
                                        }}
                                    />
                                </a>
                                <a href={APP_FORUMS}>
                                    <FormattedMessage
                                        defaultMessage="{APP_NAME} Forums"
                                        description="Button to give feedback in the menu bar"
                                        id="tw.topicButton"
                                        values={{
                                            APP_NAME,
                                        }}
                                    />
                                </a>
                            </>
                        )}
                        {APP_WIKI && (
                            <a href={APP_WIKI}>
                                <FormattedMessage
                                    defaultMessage="AmpMod Wiki"
                                    description="Link in footer to wiki"
                                    id="tw.footer.wiki"
                                />
                            </a>
                        )}
                        <a href="credits.html">
                            <FormattedMessage
                                defaultMessage="Credits"
                                description="Credits link in footer"
                                id="tw.footer.credits"
                            />
                        </a>
                    </div>
                    <div className={styles.footerSection}>
                        <h3>Resources</h3>
                        <a href="https://ampmod.codeberg.page/extensions/">
                            <FormattedMessage
                                defaultMessage="Extension Gallery"
                                description="Link in footer to extension gallery"
                                id="tw.footer.extensions"
                            />
                        </a>
                        <a href="https://ampmod.codeberg.page/manual/">
                            <FormattedMessage
                                defaultMessage="Manual"
                                description="Link in footer to manual"
                                id="tw.footer.manual"
                            />
                        </a>
                        <a href={APP_SOURCE}>
                            <FormattedMessage
                                defaultMessage="Source Code"
                                description="Link to source code"
                                id="tw.code"
                            />
                        </a>
                        {process.env.ampmod_mode === "canary" ? (
                            <a href="https://ampmod.codeberg.page/">
                                <FormattedMessage
                                    defaultMessage="Stable Build"
                                    description="Link to the stable build of AmpMod"
                                    id="amp.production"
                                />
                            </a>
                        ) : (
                            <a href="https://ampmod.codeberg.page/canary/">
                                <FormattedMessage
                                    defaultMessage="Canary Build"
                                    description="Link to the canary build of AmpMod"
                                    id="amp.canary"
                                />
                            </a>
                        )}
                        {/*<a href="https://desktop.turbowarp.org/">
                            {"TurboWarp Desktop"}
                        </a>
                        <a href="https://packager.turbowarp.org/">
                            {"TurboWarp Packager"}
                        </a>                        <a href="https://docs.turbowarp.org/embedding">
                            <FormattedMessage
                                defaultMessage="Embedding"
                                description="Link in footer to embedding documentation for embedding link"
                                id="tw.footer.embed"
                            />
                        </a>*/}
                        <a href="https://docs.turbowarp.org/url-parameters">
                            <FormattedMessage
                                defaultMessage="URL Parameters"
                                description="Link in footer to URL parameters documentation"
                                id="tw.footer.parameters"
                            />
                        </a>
                    </div>
                    <div className={styles.footerSection}>
                        <h3>Legal</h3>
                        <a href="privacy.html">
                            <FormattedMessage
                                defaultMessage="Privacy Policy"
                                description="Link to privacy policy"
                                id="tw.privacy"
                            />
                        </a>
                    </div>
                </div>
            </div>
            {isAprilFools() && <div className={styles.semicolon}>;</div>}
        </footer>
    );
};

export default Footer;

import {useEffect, useState} from 'react';
import styles from '../design.css';
import {APP_NAME} from '@ampmod/branding';
import lsNamespace from '../../lib/amp-localstorage-namespace';

export default () => {
    const [analyticsOptOut, setAnalyticsOptOut] = useState(false);

    useEffect(() => {
        const optedOut = localStorage.getItem(`${lsNamespace}analytics-opted-out`) === 'true';
        setAnalyticsOptOut(optedOut);
    }, []);

    const handleCheckboxChange = e => {
        const checked = e.target.checked;
        setAnalyticsOptOut(checked);
        if (checked) {
            localStorage.setItem(`${lsNamespace}analytics-opted-out`, 'true');
        } else {
            localStorage.removeItem(`${lsNamespace}analytics-opted-out`);
        }
    };

    return (
        <>
            <header className={styles.headerContainer}>
                <h1>{APP_NAME} Privacy Policy</h1>
            </header>
            <main className={styles.main}>
                <section>
                    <p>
                        <i>Updated 13 December, 2025</i>
                    </p>

                    <p>
                        <b>The {APP_NAME} project respects your privacy.</b> Every website says this, but we mean it: We
                        aren't interested in your data. In the interest of full transparency, this document lists every
                        place where your data might be collected or shared:
                    </p>

                    <h2>{APP_NAME} editor</h2>

                    {process.env.ampmod_is_cbp && (
                        <>
                            <h3>Analytics</h3>
                            <p>
                                {APP_NAME} uses Simple Analytics to get info about what pages are visited.
                                <strong>No personal info is collected.</strong> Simple Analytics is fully compliant with
                                the GDPR and other privacy laws.
                            </p>
                            <p>
                                We do not collect analytics in embedded widgets placed on other sites. In that case, you
                                are subject to the website's privacy policy.
                            </p>
                            <p>If you want to opt out, click the checkbox below.</p>
                            <div>
                                <label>
                                    <input type="checkbox" checked={analyticsOptOut} onChange={handleCheckboxChange} />
                                    Disable analytics
                                </label>
                            </div>

                            <h3>Cloud variables</h3>
                        </>
                    )}

                    <p>
                        A randomly generated username may be saved in your browser. You can replace this with a custom
                        username. Randomly generated usernames are anonymized (the random part is removed) before being
                        sent to any cloud variable server.
                    </p>

                    <h2>Loading projects</h2>
                    <p>
                        When you load a project from another website, you are subject to the privacy practices of that
                        website. For example, when loading projects from Scratch, you are subject to the{' '}
                        <a href="https://scratch.mit.edu/privacy_policy">Scratch privacy policy</a>. When loading
                        projects from Scratch specifically, the project ID will also be shared with TurboWarp as part of
                        Scratch's API does not allow direct access. We may briefly log the project ID for caching.
                    </p>

                    <h2>Running projects</h2>
                    <p>
                        When connecting to our cloud variable servers, the project ID and username may be logged for 14
                        days. Data in cloud variables is sent to anyone else connected at the same time. Custom cloud
                        variable servers are outside of our control.
                    </p>
                    <p>
                        Some extensions must communicate with external APIs to function. For example, the translate and
                        text-to-speech extensions rely on the Scratch API, which is covered by the{' '}
                        <a href="https://scratch.mit.edu/privacy_policy">Scratch privacy policy</a>. To improve
                        performance, some extensions access {APP_NAME}
                        's APIs instead, where both the request (for example, the text being translated) and the result
                        may be cached.
                    </p>
                    <p>
                        Most extensions on the{' '}
                        <a href="https://ampmod.codeberg.page/extensions">official extension gallery</a> will ask for
                        permission when the project attempts to use the extension to access an untrusted website;
                        however we cannot guarantee this is 100% reliable.
                    </p>
                    <p>
                        When loading a custom extension from a place other than the official gallery such as a URL or
                        file on your computer, the editor will ask for permission to load the extension. If you approve
                        this dialog, the extension can bypass the permission dialogs that official extensions show.
                    </p>

                    <h2>Settings</h2>
                    <p>Many {APP_NAME} websites, including the editor, will store settings in your browser.</p>

                    <h2>Contact</h2>
                    <p>
                        Any concerns related to privacy or any other matter should be sent to:{' '}
                        <a href="mailto:ampelectrecuted@gmail.com">ampelectrecuted@gmail.com</a>
                    </p>
                </section>
            </main>
        </>
    );
};

import ReactDOM from "react-dom";
import { setAppElement } from "react-modal";
import * as bowser from "bowser";
import { APP_NAME, APP_SOURCE } from "@ampmod/branding";

// amp: Non-foolproof check to prevent copyleft violations
// TODO: Make this run in other components of the source code too, maybe even branding itself
if (
    !APP_SOURCE ||
    (APP_NAME !== "AmpMod" &&
        APP_SOURCE == "https://codeberg.org/ampmod/ampmod")
) {
    alert(
        "LEGAL WARNING! The developer of this fork is violating the AmpMod licence.\n\n" +
            "This fork of AmpMod does not have a link to its source code or uses the original link. Per the GPLv3 and MPL, you must release your source code if you are distributing modified versions.\n\n" +
            "If you are a user, please use the official editor at: https://ampmod.codeberg.page\n\n" +
            "If you are a developer of this fork, please release your source code if you haven't already and add the link. If you are not willing to do so, destroy the source code of this fork.\n\n" +
            "(We are not lawyers. Please speak to one for more information.)"
    );
    throw new Error("This is an illegal, non-GPL compliant fork of AmpMod.");
}

const appTarget = document.getElementById("app");
let migrationOccurred = false;
/**
 * amp: Migrates all localStorage keys that start with a given prefix to a new prefix.
 * This function is synchronous.
 * @param {string} oldPrefix The prefix to search for (e.g., "tw:").
 * @param {string} newPrefix The new prefix to use (e.g., "amp:").
 * @returns {boolean} True if any keys were migrated, false otherwise.
 */
function migrateLocalStorageKeys(oldPrefix, newPrefix) {
    let migrated = false;
    const keysToMigrate = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(oldPrefix)) {
            keysToMigrate.push(key);
        }
    }
    if (keysToMigrate.length === 0) {
        return false;
    }
    keysToMigrate.forEach(oldKey => {
        window.SetCustomSplashInfo(
            `Migrating key name ${oldKey}... If this fails, <a href="https://ampmod.flarum.cloud/t/bugs-and-glitches">please report as a bug</a>.`
        );
        const newKey = newPrefix + oldKey.substring(oldPrefix.length);
        const value = localStorage.getItem(oldKey);
        localStorage.setItem(newKey, value);
        localStorage.removeItem(oldKey);
        console.info(`SUCCESS: Migrated ${oldKey} to ${newKey}.`);
        migrated = true;
    });
    return migrated;
}

/**
 * Migrates an IndexedDB database by creating a new one, copying all data,
 * and then deleting the old database. This function is asynchronous.
 * @param {string} oldDbName The name of the database to migrate (e.g., "TW_Database").
 * @param {string} newDbName The new name for the database (e.g., "Amp_Database").
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async function migrateIndexedDB(oldDbName, newDbName) {
    return new Promise((resolve, reject) => {
        const openOldReq = indexedDB.open(oldDbName);
        openOldReq.onerror = () =>
            reject(`Error opening old database: ${openOldReq.error}`);
        openOldReq.onsuccess = event => {
            const dbOld = event.target.result;
            const objectStoreNames = dbOld.objectStoreNames;

            // Check for empty objectStoreNames to avoid "Empty scope" error
            if (objectStoreNames.length === 0) {
                console.info(
                    `INFO: Old database "${oldDbName}" has no object stores. Skipping migration.`
                );
                dbOld.close();
                const deleteReq = indexedDB.deleteDatabase(oldDbName);
                deleteReq.onerror = () =>
                    reject(`Error deleting empty database: ${deleteReq.error}`);
                deleteReq.onsuccess = () => resolve();
                return;
            }

            const openNewReq = indexedDB.open(newDbName, dbOld.version);
            openNewReq.onupgradeneeded = e => {
                const dbNew = e.target.result;
                for (let i = 0; i < objectStoreNames.length; i++) {
                    dbNew.createObjectStore(objectStoreNames[i], {
                        keyPath: "id",
                    });
                }
            };

            openNewReq.onerror = e => {
                if (e.target.error.name === "VersionError") {
                    console.log(
                        `INFO: Database ${newDbName} is already at a higher version. Assuming migration is complete.`
                    );
                    resolve();
                } else {
                    reject(`Error creating new database: ${e.target.error}`);
                }
            };

            openNewReq.onsuccess = e => {
                const dbNew = e.target.result;
                const transactionOld = dbOld.transaction(
                    Array.from(objectStoreNames),
                    "readonly"
                );
                const transactionNew = dbNew.transaction(
                    Array.from(objectStoreNames),
                    "readwrite"
                );
                transactionOld.onerror = () =>
                    reject(`Old transaction error: ${transactionOld.error}`);
                transactionNew.onerror = () =>
                    reject(`New transaction error: ${transactionNew.error}`);

                transactionNew.oncomplete = () => {
                    dbOld.close();
                    const deleteReq = indexedDB.deleteDatabase(oldDbName);
                    deleteReq.onerror = () =>
                        reject(
                            `Error deleting old database: ${deleteReq.error}`
                        );
                    deleteReq.onsuccess = () => {
                        console.log(
                            `SUCCESS: Migrated database ${oldDbName} to ${newDbName}.`
                        );
                        resolve();
                    };
                };

                for (const storeName of objectStoreNames) {
                    const oldStore = transactionOld.objectStore(storeName);
                    const newStore = transactionNew.objectStore(storeName);
                    oldStore.openCursor().onsuccess = event => {
                        const cursor = event.target.result;
                        if (cursor) {
                            newStore.add(cursor.value);
                            cursor.continue();
                        }
                    };
                }
            };
        };
    });
}

/**
 * Main function to perform all migration operations.
 */
async function runAllMigrations() {
    const oldPrefix = "tw_";
    const newPrefix = "Amp_";
    const oldDbNames = ["TW_RestorePoints", "TW_Backpack"];

    // Part 1: Migrate localStorage keys.
    if (migrateLocalStorageKeys("tw:", "amp:")) {
        migrationOccurred = true;
    }

    // Part 2: Migrate IndexedDB databases.
    const dbsToMigrate = [];
    for (const oldDbName of oldDbNames) {
        const newDbName = newPrefix + oldDbName.substring(oldPrefix.length);

        // Use a promise to check for the existence of the new database
        const newDbExists = await new Promise(resolve => {
            const req = indexedDB.open(newDbName);
            req.onsuccess = e => {
                e.target.result.close();
                resolve(true);
            };
            req.onerror = () => {
                // Assuming the database doesn't exist if there's an error.
                resolve(false);
            };
        });

        // If the new database doesn't exist, we should try to migrate.
        if (!newDbExists) {
            // Check if the old database actually exists before adding it to the list.
            const oldDbExists = await new Promise(resolve => {
                const req = indexedDB.open(oldDbName);
                req.onsuccess = e => {
                    e.target.result.close();
                    resolve(true);
                };
                req.onerror = () => {
                    resolve(false);
                };
            });
            if (oldDbExists) {
                dbsToMigrate.push(oldDbName);
            }
        }
    }

    if (dbsToMigrate.length === 0) {
        console.log(
            `No IndexedDB databases found with prefix "${oldPrefix}" or migration already complete.`
        );
    } else {
        for (const oldDbName of dbsToMigrate) {
            const newDbName = newPrefix + oldDbName.substring(oldPrefix.length);
            try {
                window.SetCustomSplashInfo(
                    `Migrating database ${oldDbName}... If this fails, <a href="https://ampmod.flarum.cloud/t/bugs-and-glitches">please report as a bug</a>.`
                );
                await migrateIndexedDB(oldDbName, newDbName);
                migrationOccurred = true;
            } catch (e) {
                console.error(`Failed to migrate database "${oldDbName}":`, e);
            }
        }
    }

    // Part 3: Reload if any migrations occurred.
    if (migrationOccurred) {
        window.SetCustomSplashInfo("Done! Reloading...");
        window.location.reload();
    }
}

if (new URLSearchParams(window.location.search).has("crash-accidentally")) {
    throw new TypeError(
        "Simulated a TypeError to test the pre-React error screen. " +
            `If someone sent you a link to this, just open ${APP_NAME} in ` +
            "a new tab and carry on with your day. This is not a bug."
    );
}

setAppElement(appTarget);

const render = children => {
    if (!process.env.ampmod_is_canary) {
        runAllMigrations();
    }
    if (!migrationOccurred) {
        ReactDOM.render(children, appTarget);
        if (window.SplashEnd) {
            window.SplashEnd();
        }
    }
};

export const renderToBottom = children => {
    if (!migrationOccurred) {
        ReactDOM.render(children, document.getElementById("app-footer"));
    }
};

export default render;

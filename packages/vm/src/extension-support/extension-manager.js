const dispatch = require("../dispatch/central-dispatch");
const log = require("../util/log");
const maybeFormatMessage = require("../util/maybe-format-message");

const BlockType = require("./block-type");
const SecurityManager = require("./tw-security-manager");

/**
 * Built-in extensions to load dynamically in async mode only.
 */
const defaultBuiltinExtensions = {
    coreExample: () => import("../blocks/scratch3_core_example"),
    pen: () => import("../extensions/scratch3_pen"),
    wedo2: () => import("../extensions/scratch3_wedo2"),
    music: () => import("../extensions/scratch3_music"),
    microbit: () => import("../extensions/scratch3_microbit"),
    text2speech: () => import("../extensions/scratch3_text2speech"),
    translate: () => import("../extensions/scratch3_translate"),
    videoSensing: () => import("../extensions/scratch3_video_sensing"),
    ev3: () => import("../extensions/scratch3_ev3"),
    makeymakey: () => import("../extensions/scratch3_makeymakey"),
    boost: () => import("../extensions/scratch3_boost"),
    gdxfor: () => import("../extensions/scratch3_gdx_for"),
    // ampmod extensions
    future: () => import("../extensions/ampmod_future"),
    electroTest: () => import("../extensions/ampmod_electro_test"),
};

/**
 * Create the dispatch service for extensions.
 */
const createExtensionService = extensionManager => {
    const service = {};
    service.registerExtensionServiceSync =
        extensionManager.registerExtensionServiceSync.bind(extensionManager);
    service.allocateWorker =
        extensionManager.allocateWorker.bind(extensionManager);
    service.onWorkerInit = extensionManager.onWorkerInit.bind(extensionManager);
    service.registerExtensionService =
        extensionManager.registerExtensionService.bind(extensionManager);
    return service;
};

class ExtensionManager {
    constructor(vm) {
        this.nextExtensionWorker = 0;
        this.pendingExtensions = [];
        this.pendingWorkers = [];
        this.workerURLs = [];
        this._loadedExtensions = new Map();
        this.securityManager = new SecurityManager();
        this.vm = vm;
        this.runtime = vm.runtime;

        this.loadingAsyncExtensions = 0;
        this.asyncExtensionsLoadedCallbacks = [];

        this.builtinExtensions = Object.assign({}, defaultBuiltinExtensions);

        dispatch
            .setService("extensions", createExtensionService(this))
            .catch(e => {
                log.error(
                    `ExtensionManager was unable to register extension service: ${JSON.stringify(
                        e
                    )}`
                );
            });
    }

    isExtensionLoaded(extensionID) {
        return this._loadedExtensions.has(extensionID);
    }

    isBuiltinExtension(extensionId) {
        return Object.prototype.hasOwnProperty.call(
            this.builtinExtensions,
            extensionId
        );
    }

    /**
     * Synchronously load a built-in extension by ID (calls async loader).
     */
    loadExtensionIdSync(extensionId) {
        if (!this.isBuiltinExtension(extensionId)) {
            log.warn(
                `Could not find extension ${extensionId} in the built-in extensions.`
            );
            return;
        }

        if (this.isExtensionLoaded(extensionId)) {
            log.warn(`Extension ${extensionId} is already loaded.`);
            return;
        }

        // Call the async loader
        this.loadExtensionIdAsync(extensionId).catch(e =>
            log.error(`Failed to load extension ${extensionId}`, e)
        );
    }

    /**
     * Asynchronously load a built-in extension by ID.
     */
    async loadExtensionIdAsync(extensionId) {
        if (!this.isBuiltinExtension(extensionId)) {
            log.warn(
                `Could not find extension ${extensionId} in the built-in extensions.`
            );
            return;
        }

        if (this.isExtensionLoaded(extensionId)) {
            log.warn(`Extension ${extensionId} is already loaded.`);
            return;
        }

        this.loadingAsyncExtensions++;

        try {
            // Load the extension class dynamically
            const extensionClassOrModule =
                await this.builtinExtensions[extensionId]();

            // Handle default exports from ESM modules
            const ExtensionClass =
                extensionClassOrModule.default || extensionClassOrModule;

            // Create an instance
            const extensionObject =
                typeof ExtensionClass === "function"
                    ? new ExtensionClass(this.vm.runtime)
                    : ExtensionClass;

            // Register as internal extension (unsandboxed)
            const serviceName =
                this._registerInternalExtension(extensionObject);

            // Mark extension as loaded
            this._loadedExtensions.set(extensionId, serviceName);

            // Refresh blocks for this extension
            await this.refreshBlocks(extensionId);
        } catch (error) {
            log.error(
                `Failed to asynchronously load extension ${extensionId}`,
                error
            );
            throw error;
        } finally {
            this.loadingAsyncExtensions--;
            if (this.loadingAsyncExtensions === 0) {
                this.asyncExtensionsLoadedCallbacks.forEach(cb => cb.resolve());
                this.asyncExtensionsLoadedCallbacks = [];
            }
        }
    }

    addBuiltinExtension(extensionId, extensionClass) {
        this.builtinExtensions[extensionId] = () => extensionClass;
    }

    _isValidExtensionURL(extensionURL) {
        try {
            const parsedURL = new URL(extensionURL);
            return (
                parsedURL.protocol === "https:" ||
                parsedURL.protocol === "http:" ||
                parsedURL.protocol === "data:" ||
                parsedURL.protocol === "file:"
            );
        } catch (e) {
            return false;
        }
    }

    async loadExtensionURL(extensionURL) {
        if (this.isBuiltinExtension(extensionURL)) {
            await this.loadExtensionIdAsync(extensionURL);
            return;
        }

        if (this.isExtensionURLLoaded(extensionURL)) {
            return;
        }

        if (!this._isValidExtensionURL(extensionURL)) {
            throw new Error(`Invalid extension URL: ${extensionURL}`);
        }

        this.runtime.setExternalCommunicationMethod("customExtensions", true);
        this.loadingAsyncExtensions++;

        const sandboxMode =
            await this.securityManager.getSandboxMode(extensionURL);
        const rewritten =
            await this.securityManager.rewriteExtensionURL(extensionURL);

        if (sandboxMode === "unsandboxed") {
            const { load } = require("./tw-unsandboxed-extension-runner");
            const extensionObjects = await load(rewritten, this.vm).catch(
                error => this._failedLoadingExtensionScript(error)
            );
            const fakeWorkerId = this.nextExtensionWorker++;
            this.workerURLs[fakeWorkerId] = extensionURL;

            for (const extensionObject of extensionObjects) {
                const extensionInfo = extensionObject.getInfo();
                const serviceName = `unsandboxed.${fakeWorkerId}.${extensionInfo.id}`;
                dispatch.setServiceSync(serviceName, extensionObject);
                dispatch.callSync(
                    "extensions",
                    "registerExtensionServiceSync",
                    serviceName
                );
                this._loadedExtensions.set(extensionInfo.id, serviceName);
            }

            this._finishedLoadingExtensionScript();
            return;
        }

        let ExtensionWorker;
        if (sandboxMode === "worker") {
            ExtensionWorker = require("worker-loader?name=js/extension-worker/extension-worker.[hash].js!./extension-worker");
        } else if (sandboxMode === "iframe") {
            ExtensionWorker = (await import("./tw-iframe-extension-worker"))
                .default;
        } else {
            throw new Error(`Invalid sandbox mode: ${sandboxMode}`);
        }

        return new Promise((resolve, reject) => {
            this.pendingExtensions.push({
                extensionURL: rewritten,
                resolve,
                reject,
            });
            dispatch.addWorker(new ExtensionWorker());
        }).catch(error => this._failedLoadingExtensionScript(error));
    }

    allAsyncExtensionsLoaded() {
        if (this.loadingAsyncExtensions === 0) {
            return;
        }
        return new Promise((resolve, reject) => {
            this.asyncExtensionsLoadedCallbacks.push({
                resolve,
                reject,
            });
        });
    }

    refreshBlocks(optExtensionId) {
        const refresh = serviceName =>
            dispatch
                .call(serviceName, "getInfo")
                .then(info => {
                    info = this._prepareExtensionInfo(serviceName, info);
                    dispatch.call(
                        "runtime",
                        "_refreshExtensionPrimitives",
                        info
                    );
                })
                .catch(e => {
                    log.error(
                        "Failed to refresh built-in extension primitives",
                        e
                    );
                });
        if (optExtensionId) {
            if (!this._loadedExtensions.has(optExtensionId)) {
                return Promise.reject(
                    new Error(`Unknown extension: ${optExtensionId}`)
                );
            }
            return refresh(this._loadedExtensions.get(optExtensionId));
        }
        const allPromises = Array.from(this._loadedExtensions.values()).map(
            refresh
        );
        return Promise.all(allPromises);
    }

    allocateWorker() {
        const id = this.nextExtensionWorker++;
        const workerInfo = this.pendingExtensions.shift();
        this.pendingWorkers[id] = workerInfo;
        this.workerURLs[id] = workerInfo.extensionURL;
        return [id, workerInfo.extensionURL];
    }

    registerExtensionServiceSync(serviceName) {
        const info = dispatch.callSync(serviceName, "getInfo");
        this._registerExtensionInfo(serviceName, info);
    }

    registerExtensionService(serviceName) {
        dispatch.call(serviceName, "getInfo").then(info => {
            this._loadedExtensions.set(info.id, serviceName);
            this._registerExtensionInfo(serviceName, info);
            this._finishedLoadingExtensionScript();
        });
    }

    _finishedLoadingExtensionScript() {
        this.loadingAsyncExtensions--;
        if (this.loadingAsyncExtensions === 0) {
            this.asyncExtensionsLoadedCallbacks.forEach(i => i.resolve());
            this.asyncExtensionsLoadedCallbacks = [];
        }
    }

    _failedLoadingExtensionScript(error) {
        this.loadingAsyncExtensions--;
        this.asyncExtensionsLoadedCallbacks.forEach(i => i.reject(error));
        this.asyncExtensionsLoadedCallbacks = [];
        throw error;
    }

    onWorkerInit(id, e) {
        const workerInfo = this.pendingWorkers[id];
        delete this.pendingWorkers[id];
        if (e) {
            workerInfo.reject(e);
        } else {
            workerInfo.resolve();
        }
    }

    _registerInternalExtension(extensionObject) {
        const extensionInfo = extensionObject.getInfo();
        const fakeWorkerId = this.nextExtensionWorker++;
        const serviceName = `extension_${fakeWorkerId}_${extensionInfo.id}`;
        dispatch.setServiceSync(serviceName, extensionObject);
        dispatch.callSync(
            "extensions",
            "registerExtensionServiceSync",
            serviceName
        );
        return serviceName;
    }

    _registerExtensionInfo(serviceName, extensionInfo) {
        extensionInfo = this._prepareExtensionInfo(serviceName, extensionInfo);
        dispatch
            .call("runtime", "_registerExtensionPrimitives", extensionInfo)
            .catch(e => {
                log.error(
                    `Failed to register primitives for extension on service ${serviceName}:`,
                    e
                );
            });
    }

    _prepareExtensionInfo(serviceName, extensionInfo) {
        extensionInfo = Object.assign({}, extensionInfo);
        if (!/^[a-z0-9]+$/i.test(extensionInfo.id)) {
            throw new Error("Invalid extension id");
        }
        extensionInfo.name = extensionInfo.name || extensionInfo.id;
        extensionInfo.blocks = extensionInfo.blocks || [];
        extensionInfo.targetTypes = extensionInfo.targetTypes || [];
        extensionInfo.blocks = extensionInfo.blocks.reduce(
            (results, blockInfo) => {
                try {
                    let result;
                    switch (blockInfo) {
                        case "---":
                            result = "---";
                            break;
                        default:
                            result = this._prepareBlockInfo(
                                serviceName,
                                blockInfo
                            );
                            break;
                    }
                    results.push(result);
                } catch (e) {
                    log.error(
                        `Error processing block: ${e.message}, Block:\n${JSON.stringify(
                            blockInfo
                        )}`
                    );
                }
                return results;
            },
            []
        );
        extensionInfo.menus = extensionInfo.menus || {};
        extensionInfo.menus = this._prepareMenuInfo(
            serviceName,
            extensionInfo.menus
        );
        return extensionInfo;
    }

    _prepareMenuInfo(serviceName, menus) {
        const menuNames = Object.getOwnPropertyNames(menus);
        for (let i = 0; i < menuNames.length; i++) {
            const menuName = menuNames[i];
            let menuInfo = menus[menuName];

            if (!menuInfo.items) {
                menuInfo = { items: menuInfo };
                menus[menuName] = menuInfo;
            }
            if (typeof menuInfo.items === "string") {
                const menuItemFunctionName = menuInfo.items;
                const serviceObject = dispatch.services[serviceName];
                menuInfo.items = this._getExtensionMenuItems.bind(
                    this,
                    serviceObject,
                    menuItemFunctionName
                );
            }
        }
        return menus;
    }

    _getExtensionMenuItems(extensionObject, menuItemFunctionName) {
        const editingTarget =
            this.runtime.getEditingTarget() || this.runtime.getTargetForStage();
        const editingTargetID = editingTarget ? editingTarget.id : null;
        const extensionMessageContext =
            this.runtime.makeMessageContextForTarget(editingTarget);

        const menuFunc = extensionObject[menuItemFunctionName];
        const menuItems = menuFunc
            .call(extensionObject, editingTargetID)
            .map(item => {
                item = maybeFormatMessage(item, extensionMessageContext);
                switch (typeof item) {
                    case "object":
                        return [
                            maybeFormatMessage(
                                item.text,
                                extensionMessageContext
                            ),
                            item.value,
                        ];
                    case "string":
                        return [item, item];
                    default:
                        return item;
                }
            });

        if (!menuItems || menuItems.length < 1) {
            throw new Error(
                `Extension menu returned no items: ${menuItemFunctionName}`
            );
        }
        return menuItems;
    }

    _prepareBlockInfo(serviceName, blockInfo) {
        if (blockInfo.blockType === BlockType.XML) {
            blockInfo = Object.assign({}, blockInfo);
            blockInfo.xml = String(blockInfo.xml) || "";
            return blockInfo;
        }

        blockInfo = Object.assign(
            {},
            {
                blockType: BlockType.COMMAND,
                terminal: false,
                blockAllThreads: false,
                arguments: {},
            },
            blockInfo
        );
        blockInfo.text = blockInfo.text || blockInfo.opcode;

        switch (blockInfo.blockType) {
            case BlockType.EVENT:
                if (blockInfo.func) {
                    log.warn(
                        `Ignoring function "${blockInfo.func}" for event block ${blockInfo.opcode}`
                    );
                }
                break;
            case BlockType.BUTTON:
                if (blockInfo.opcode) {
                    log.warn(
                        `Ignoring opcode "${blockInfo.opcode}" for button with text: ${blockInfo.text}`
                    );
                }
                blockInfo.callFunc = () => {
                    dispatch.call(serviceName, blockInfo.func);
                };
                break;
            default:
                break;
        }
        return blockInfo;
    }

    isExtensionURLLoaded(extensionURL) {
        return this.workerURLs.includes(extensionURL);
    }
}

module.exports = ExtensionManager;

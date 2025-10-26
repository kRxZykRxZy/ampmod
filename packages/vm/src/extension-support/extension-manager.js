const dispatch = require("../dispatch/central-dispatch");
const log = require("../util/log");
const maybeFormatMessage = require("../util/maybe-format-message");
const BlockType = require("./block-type");
const SecurityManager = require("./tw-security-manager");
const PenExtension = require("../extensions/scratch3_pen");

/**
 * Built-in extensions to the VM. These are loaded dynamically using async `import()`.
 * Core extensions are not included here; this is for optional built-ins.
 */
const defaultBuiltinExtensions = {
    coreExample: () =>
        import(
            /* webpackChunkName: "extension-coreExample" */ "../blocks/scratch3_core_example"
        ),
    pen: () => PenExtension,
    wedo2: () =>
        import(
            /* webpackChunkName: "extension-wedo2" */ "../extensions/scratch3_wedo2"
        ),
    music: () =>
        import(
            /* webpackChunkName: "extension-music" */ "../extensions/scratch3_music"
        ),
    microbit: () =>
        import(
            /* webpackChunkName: "extension-microbit" */ "../extensions/scratch3_microbit"
        ),
    text2speech: () =>
        import(
            /* webpackChunkName: "extension-text2speech" */ "../extensions/scratch3_text2speech"
        ),
    translate: () =>
        import(
            /* webpackChunkName: "extension-translate" */ "../extensions/scratch3_translate"
        ),
    videoSensing: () =>
        import(
            /* webpackChunkName: "extension-video-sensing" */ "../extensions/scratch3_video_sensing"
        ),
    ev3: () =>
        import(
            /* webpackChunkName: "extension-ev3" */ "../extensions/scratch3_ev3"
        ),
    makeymakey: () =>
        import(
            /* webpackChunkName: "extension-makeymakey" */ "../extensions/scratch3_makeymakey"
        ),
    boost: () =>
        import(
            /* webpackChunkName: "extension-boost" */ "../extensions/scratch3_boost"
        ),
    gdxfor: () =>
        import(
            /* webpackChunkName: "extension-gdxfor" */ "../extensions/scratch3_gdx_for"
        ),
    // amp: exclusive extensions
    future: () => {
        /* compatibility */
    },
    electroTest: () =>
        import(
            /* webpackChunkName: "electrotest" */ "../extensions/ampmod_electro_test"
        ),
};

/**
 * Create an object representing the extension service, bound to the given extensionManager instance.
 * This allows dispatching commands to extension workers.
 * @param {ExtensionManager} extensionManager
 */
const createExtensionService = extensionManager => ({
    registerExtensionServiceSync:
        extensionManager.registerExtensionServiceSync.bind(extensionManager),
    allocateWorker: extensionManager.allocateWorker.bind(extensionManager),
    onWorkerInit: extensionManager.onWorkerInit.bind(extensionManager),
    registerExtensionService:
        extensionManager.registerExtensionService.bind(extensionManager),
});

class ExtensionManager {
    /**
     * @param {VirtualMachine} vm - reference to the VM instance
     */
    constructor(vm) {
        /**
         * Reference to the VM runtime
         * @type {Runtime}
         */
        this.vm = vm;
        this.runtime = vm.runtime;

        /**
         * The ID to assign to the next allocated extension worker
         * @type {number}
         */
        this.nextExtensionWorker = 0;

        /**
         * FIFO queue of pending extensions awaiting worker allocation
         * @type {Array.<PendingExtensionWorker>}
         */
        this.pendingExtensions = [];

        /**
         * Map of worker IDs to pending worker info
         * @type {Array.<PendingExtensionWorker>}
         */
        this.pendingWorkers = [];

        /**
         * Map of worker IDs to extension URLs
         * @type {Array.<string>}
         */
        this.workerURLs = [];

        /**
         * Map of loaded extension IDs/URLs to service names
         * @type {Map<string, string>}
         * @private
         */
        this._loadedExtensions = new Map();

        /**
         * Manages security policies for extensions
         * @type {SecurityManager}
         */
        this.securityManager = new SecurityManager();

        /**
         * Number of async extensions currently loading
         * @type {number}
         */
        this.loadingAsyncExtensions = 0;

        /**
         * Callbacks to invoke once all async extensions are loaded
         * @type {Array<{resolve: Function, reject: Function}>}
         */
        this.asyncExtensionsLoadedCallbacks = [];

        /**
         * Built-in extension loaders
         */
        this.builtinExtensions = { ...defaultBuiltinExtensions };

        // Register the extension service for dispatch
        dispatch
            .setService("extensions", createExtensionService(this))
            .catch(e => {
                log.error("ExtensionManager failed to register service:", e);
            });
    }

    /**
     * Check whether an extension has already been loaded
     * @param {string} extensionID
     * @returns {boolean}
     */
    isExtensionLoaded(extensionID) {
        return this._loadedExtensions.has(extensionID);
    }

    /**
     * Check whether an extension is built-in
     * @param {string} extensionId
     * @returns {boolean}
     */
    isBuiltinExtension(extensionId) {
        return Object.prototype.hasOwnProperty.call(
            this.builtinExtensions,
            extensionId
        );
    }

    /**
     * Asynchronously load an internal extension (core or non-core) by ID
     * @param {string} extensionId
     */
    async loadExtensionIdAsync(extensionId) {
        if (!this.isBuiltinExtension(extensionId)) {
            log.warn(
                `Could not find extension ${extensionId} in the built-in extensions.`
            );
            return;
        }

        if (this.isExtensionLoaded(extensionId)) {
            log.warn(
                `Rejecting attempt to load a second extension with ID ${extensionId}`
            );
            return;
        }

        try {
            const extensionModule = await this.builtinExtensions[extensionId]();
            const ExtensionClass = extensionModule.default || extensionModule; // support CJS & ESM
            const extensionInstance = new ExtensionClass(this.runtime);

            const serviceName =
                this._registerInternalExtension(extensionInstance);
            this._loadedExtensions.set(extensionId, serviceName);
            this.runtime.compilerRegisterExtension(
                extensionId,
                extensionInstance
            );
        } catch (e) {
            log.error(`Failed to load extension ${extensionId}:`, e);
        }
    }

    /**
     * "Synchronous" wrapper for loading an extension (calls async version and logs errors)
     * @param {string} extensionId
     */
    loadExtensionIdSync(extensionId) {
        this.loadExtensionIdAsync(extensionId).catch(e => {
            log.error(
                `Failed to load extension ${extensionId} in sync mode:`,
                e
            );
        });
    }

    /**
     * Add a new built-in extension
     * @param {string} extensionId
     * @param {Function} extensionClass
     */
    addBuiltinExtension(extensionId, extensionClass) {
        this.builtinExtensions[extensionId] = () => extensionClass;
    }

    /**
     * Load an extension by URL or internal extension ID
     * @param {string} extensionURL
     * @returns {Promise<void>}
     */
    async loadExtensionURL(extensionURL) {
        if (this.isBuiltinExtension(extensionURL)) {
            await this.loadExtensionIdAsync(extensionURL);
            return;
        }

        if (this.isExtensionURLLoaded(extensionURL)) return;

        if (!this._isValidExtensionURL(extensionURL)) {
            throw new Error(`Invalid extension URL: ${extensionURL}`);
        }

        this.runtime.setExternalCommunicationMethod("customExtensions", true);
        this.loadingAsyncExtensions++;

        const sandboxMode =
            await this.securityManager.getSandboxMode(extensionURL);
        const rewrittenURL =
            await this.securityManager.rewriteExtensionURL(extensionURL);

        if (sandboxMode === "unsandboxed") {
            const { load } = require("./tw-unsandboxed-extension-runner");
            const extensionObjects = await load(rewrittenURL, this.vm).catch(
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
                extensionURL: rewrittenURL,
                resolve,
                reject,
            });
            dispatch.addWorker(new ExtensionWorker());
        }).catch(error => this._failedLoadingExtensionScript(error));
    }

    _isValidExtensionURL(extensionURL) {
        try {
            const parsedURL = new URL(extensionURL);
            return ["http:", "https:", "file:", "data:"].includes(
                parsedURL.protocol
            );
        } catch {
            return false;
        }
    }

    /**
     * Allocate a worker to the next pending extension
     * @returns {[number, string]} [workerId, extensionURL]
     */
    allocateWorker() {
        const id = this.nextExtensionWorker++;
        const workerInfo = this.pendingExtensions.shift();
        this.pendingWorkers[id] = workerInfo;
        this.workerURLs[id] = workerInfo.extensionURL;
        return [id, workerInfo.extensionURL];
    }

    /**
     * Synchronously collect extension metadata from a service
     * @param {string} serviceName
     */
    registerExtensionServiceSync(serviceName) {
        const info = dispatch.callSync(serviceName, "getInfo");
        this._registerExtensionInfo(serviceName, info);
    }

    /**
     * Collect extension metadata asynchronously from a service
     * @param {string} serviceName
     */
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
            this.asyncExtensionsLoadedCallbacks.forEach(cb => cb.resolve());
            this.asyncExtensionsLoadedCallbacks = [];
        }
    }

    _failedLoadingExtensionScript(error) {
        this.loadingAsyncExtensions--;
        this.asyncExtensionsLoadedCallbacks.forEach(cb => cb.reject(error));
        this.asyncExtensionsLoadedCallbacks = [];
        throw error;
    }

    /**
     * Called by a worker when initialization finishes
     * @param {number} id
     * @param {Error=} error
     */
    onWorkerInit(id, error) {
        const workerInfo = this.pendingWorkers[id];
        delete this.pendingWorkers[id];
        if (error) workerInfo.reject(error);
        else workerInfo.resolve();
    }

    /**
     * Register an internal (non-worker) extension
     * @param {object} extensionObject
     * @returns {string} serviceName
     */
    _registerInternalExtension(extensionObject) {
        const info = extensionObject.getInfo();
        const fakeWorkerId = this.nextExtensionWorker++;
        const serviceName = `extension_${fakeWorkerId}_${info.id}`;
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
                    `Failed to register primitives for ${serviceName}:`,
                    e
                );
            });
    }

    _prepareExtensionInfo(serviceName, info) {
        info = { ...info };
        if (!/^[a-z0-9]+$/i.test(info.id))
            throw new Error("Invalid extension id");
        info.name = info.name || info.id;
        info.blocks = info.blocks || [];
        info.targetTypes = info.targetTypes || [];
        info.blocks = info.blocks.map(block =>
            block === "---" ? "---" : this._prepareBlockInfo(serviceName, block)
        );
        info.menus = this._prepareMenuInfo(serviceName, info.menus || {});
        return info;
    }

    _prepareMenuInfo(serviceName, menus) {
        for (const name of Object.keys(menus)) {
            let menu = menus[name];
            if (!menu.items) menu = { items: menu };
            if (typeof menu.items === "string") {
                const funcName = menu.items;
                const serviceObj = dispatch.services[serviceName];
                menu.items = this._getExtensionMenuItems.bind(
                    this,
                    serviceObj,
                    funcName
                );
            }
            menus[name] = menu;
        }
        return menus;
    }

    _getExtensionMenuItems(extensionObject, funcName) {
        const editingTarget =
            this.runtime.getEditingTarget() || this.runtime.getTargetForStage();
        const context = this.runtime.makeMessageContextForTarget(editingTarget);
        const menuItems = extensionObject[funcName]
            .call(extensionObject, editingTarget?.id)
            .map(item => {
                item = maybeFormatMessage(item, context);
                if (typeof item === "object")
                    return [maybeFormatMessage(item.text, context), item.value];
                if (typeof item === "string") return [item, item];
                return item;
            });
        if (!menuItems.length)
            throw new Error(`Menu ${funcName} returned no items`);
        return menuItems;
    }

    _prepareBlockInfo(serviceName, blockInfo) {
        if (blockInfo.blockType === BlockType.XML)
            return { ...blockInfo, xml: String(blockInfo.xml) || "" };
        blockInfo = {
            blockType: BlockType.COMMAND,
            terminal: false,
            blockAllThreads: false,
            arguments: {},
            ...blockInfo,
        };
        blockInfo.text = blockInfo.text || blockInfo.opcode;

        const funcName = blockInfo.func || blockInfo.opcode;
        const serviceObj = dispatch.services[serviceName];

        const callFunc = dispatch._isRemoteService(serviceName)
            ? (args, util, realBlockInfo) =>
                  dispatch
                      .call(serviceName, funcName, args, util, realBlockInfo)
                      .then(r =>
                          ["number", "string", "boolean"].includes(typeof r)
                              ? r
                              : `${r}`
                      )
            : (args, util, realBlockInfo) =>
                  serviceObj[funcName]?.(args, util, realBlockInfo);

        blockInfo.func = (args, util) =>
            callFunc(
                args,
                util,
                blockInfo.isDynamic ? args?.mutation?.blockInfo : blockInfo
            );
        return blockInfo;
    }

    /**
     * Regenerate block info for loaded extensions.
     * @param {string} [optExtensionId] Optional extension ID
     * @returns {Promise<void[]>}
     */
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

    allAsyncExtensionsLoaded() {
        if (this.loadingAsyncExtensions === 0) return;
        return new Promise((resolve, reject) =>
            this.asyncExtensionsLoadedCallbacks.push({ resolve, reject })
        );
    }

    getExtensionURLs() {
        const urls = {};
        for (const [id, serviceName] of this._loadedExtensions.entries()) {
            if (this.isBuiltinExtension(id)) continue;
            const workerId = +serviceName.split(".")[1];
            const url = this.workerURLs[workerId];
            if (typeof url === "string") urls[id] = url;
        }
        return urls;
    }

    isExtensionURLLoaded(url) {
        return Object.values(this.workerURLs).includes(url);
    }
}

module.exports = ExtensionManager;

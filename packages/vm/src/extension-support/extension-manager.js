const dispatch = require("../dispatch/central-dispatch");
const log = require("../util/log");
const maybeFormatMessage = require("../util/maybe-format-message");

const BlockType = require("./block-type");
const SecurityManager = require("./tw-security-manager");

const defaultBuiltinExtensions = {
    coreExample: () =>
        import(
            /* webpackChunkName: "extension-coreex" */
            "../blocks/scratch3_core_example"
        ),
    pen: () =>
        import(
            /* webpackChunkName: "extension-pen" */
            "../extensions/scratch3_pen"
        ),
    wedo2: () =>
        import(
            /* webpackChunkName: "extension-wedo2" */
            "../extensions/scratch3_wedo2"
        ),
    music: () =>
        import(
            /* webpackChunkName: "extension-music" */
            "../extensions/scratch3_music"
        ),
    microbit: () =>
        import(
            /* webpackChunkName: "extension-microbit" */
            "../extensions/scratch3_microbit"
        ),
    text2speech: () =>
        import(
            /* webpackChunkName: "extension-text2speech" */
            "../extensions/scratch3_text2speech"
        ),
    translate: () =>
        import(
            /* webpackChunkName: "extension-translate" */
            "../extensions/scratch3_translate"
        ),
    videoSensing: () =>
        import(
            /* webpackChunkName: "extension-videosensing" */
            "../extensions/scratch3_video_sensing"
        ),
    ev3: () =>
        import(
            /* webpackChunkName: "extension-ev3" */
            "../extensions/scratch3_ev3"
        ),
    makeymakey: () =>
        import(
            /* webpackChunkName: "extension-makeymakey" */
            "../extensions/scratch3_makeymakey"
        ),
    boost: () =>
        import(
            /* webpackChunkName: "extension-boost" */
            "../extensions/scratch3_boost"
        ),
    gdxfor: () =>
        import(
            /* webpackChunkName: "extension-gdxfor" */
            "../extensions/scratch3_gdx_for"
        ),
    future: () =>
        import(
            /* webpackChunkName: "future-toolbox" */
            "../extensions/ampmod_future"
        ),
    electroTest: () =>
        import(
            /* webpackChunkName: "electrotest" */
            "../extensions/ampmod_electro_test"
        ),
};

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
            .catch(e =>
                log.error(
                    `ExtensionManager was unable to register extension service: ${JSON.stringify(e)}`
                )
            );
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
     * Synchronous loader now just calls async loader internally.
     * Returns a Promise for simplicity.
     */
    loadExtensionIdSync(extensionId) {
        return this.loadExtensionIdAsync(extensionId);
    }

    async loadExtensionIdAsync(extensionId) {
        if (!this.isBuiltinExtension(extensionId)) {
            log.warn(
                `Could not find extension ${extensionId} in built-in extensions.`
            );
            return;
        }

        if (this.isExtensionLoaded(extensionId)) {
            log.warn(`Extension ${extensionId} is already loaded.`);
            return;
        }

        const ExtensionModule = await this.builtinExtensions[extensionId]();
        const ExtensionClass = ExtensionModule.default || ExtensionModule;
        const extensionInstance = new ExtensionClass(this.runtime);

        const serviceName = this._registerInternalExtension(extensionInstance);
        this._loadedExtensions.set(extensionId, serviceName);
        this.runtime.compilerRegisterExtension(extensionId, extensionInstance);
    }

    addBuiltinExtension(extensionId, extensionClass) {
        this.builtinExtensions[extensionId] = () => extensionClass;
    }

    _isValidExtensionURL(extensionURL) {
        try {
            const parsedURL = new URL(extensionURL);
            return ["https:", "http:", "data:", "file:"].includes(
                parsedURL.protocol
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
        if (this.isExtensionURLLoaded(extensionURL)) return;
        if (!this._isValidExtensionURL(extensionURL))
            throw new Error(`Invalid extension URL: ${extensionURL}`);

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
            ExtensionWorker = (
                await import(
                    /* webpackChunkName: "iframe-extension-worker" */ "./tw-iframe-extension-worker"
                )
            ).default;
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
        if (this.loadingAsyncExtensions === 0) return;
        return new Promise((resolve, reject) => {
            this.asyncExtensionsLoadedCallbacks.push({ resolve, reject });
        });
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

    onWorkerInit(id, e) {
        const workerInfo = this.pendingWorkers[id];
        delete this.pendingWorkers[id];
        if (e) workerInfo.reject(e);
        else workerInfo.resolve();
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
            .catch(e =>
                log.error(
                    `Failed to register primitives for extension on service ${serviceName}:`,
                    e
                )
            );
    }

    _prepareExtensionInfo(serviceName, extensionInfo) {
        extensionInfo = Object.assign({}, extensionInfo);
        extensionInfo.name = extensionInfo.name || extensionInfo.id;
        extensionInfo.blocks = extensionInfo.blocks || [];
        extensionInfo.targetTypes = extensionInfo.targetTypes || [];
        extensionInfo.blocks = extensionInfo.blocks.map(block =>
            this._prepareBlockInfo(serviceName, block)
        );
        extensionInfo.menus = this._prepareMenuInfo(
            serviceName,
            extensionInfo.menus || {}
        );
        return extensionInfo;
    }

    _prepareMenuInfo(serviceName, menus) {
        Object.keys(menus).forEach(menuName => {
            let menuInfo = menus[menuName];
            if (!menuInfo.items) menuInfo = { items: menuInfo };
            if (typeof menuInfo.items === "string") {
                const fnName = menuInfo.items;
                const serviceObject = dispatch.services[serviceName];
                menuInfo.items = this._getExtensionMenuItems.bind(
                    this,
                    serviceObject,
                    fnName
                );
            }
            menus[menuName] = menuInfo;
        });
        return menus;
    }

    _getExtensionMenuItems(extensionObject, menuItemFunctionName) {
        const editingTarget =
            this.runtime.getEditingTarget() || this.runtime.getTargetForStage();
        const editingTargetID = editingTarget ? editingTarget.id : null;
        const ctx = this.runtime.makeMessageContextForTarget(editingTarget);
        const menuFunc = extensionObject[menuItemFunctionName];
        const items = menuFunc.call(extensionObject, editingTargetID).map(i => {
            i = maybeFormatMessage(i, ctx);
            return typeof i === "object"
                ? [maybeFormatMessage(i.text, ctx), i.value]
                : [i, i];
        });
        if (!items.length)
            throw new Error(
                `Extension menu returned no items: ${menuItemFunctionName}`
            );
        return items;
    }

    _prepareBlockInfo(serviceName, blockInfo) {
        if (blockInfo.blockType === BlockType.XML)
            return { ...blockInfo, xml: String(blockInfo.xml) || "" };

        blockInfo = Object.assign(
            {
                blockType: BlockType.COMMAND,
                terminal: false,
                blockAllThreads: false,
                arguments: {},
            },
            blockInfo
        );

        blockInfo.text = blockInfo.text || blockInfo.opcode;

        if (
            [BlockType.BUTTON, BlockType.EVENT, BlockType.LABEL].includes(
                blockInfo.blockType
            )
        ) {
            if (blockInfo.blockType === BlockType.BUTTON) {
                blockInfo.callFunc = () =>
                    dispatch.call(serviceName, blockInfo.func);
            }
            return blockInfo;
        }

        if (!blockInfo.opcode) throw new Error("Missing opcode for block");

        const funcName = blockInfo.func || blockInfo.opcode;
        const serviceObject = dispatch.services[serviceName];

        blockInfo.func = (args, util) =>
            serviceObject[funcName](args, util, blockInfo);
        return blockInfo;
    }

    getExtensionURLs() {
        const urls = {};
        for (const [
            extensionId,
            serviceName,
        ] of this._loadedExtensions.entries()) {
            if (this.isBuiltinExtension(extensionId)) continue;
            const workerId = +serviceName.split(".")[1];
            const url = this.workerURLs[workerId];
            if (url) urls[extensionId] = url;
        }
        return urls;
    }

    isExtensionURLLoaded(url) {
        return this.workerURLs.includes(url);
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
}

module.exports = ExtensionManager;

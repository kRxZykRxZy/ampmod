import PropTypes from "prop-types";
import React from "react";
import bindAll from "lodash.bindall";
import { connect } from "react-redux";
import log from "../lib/log";
import CustomExtensionModalComponent from "../components/tw-custom-extension-modal/custom-extension-modal.jsx";
import { closeCustomExtensionModal } from "../reducers/modals";
import {
    manuallyTrustExtension,
    isTrustedExtension,
} from "./tw-security-manager.jsx";
import {
    getPersistedUnsandboxed,
    setPersistedUnsandboxed,
} from "../lib/tw-persisted-unsandboxed.js";

/**
 * amp: Saves a custom extension to localStorage in the correct format.
 *
 * @param {string} name - Name of the extension.
 * @param {string} description - Description of the extension.
 * @param {object} options - Options object that can contain either jsText or uri.
 */
const saveExtensionToLocalStorage = async (name, description, options) => {
    const key = `${process.env.ampmod_is_canary ? "canary" : "amp"}:saved-custom-extensions`;
    let data = { extensions: [] };

    try {
        if (localStorage[key]) {
            data = JSON.parse(localStorage[key]);
        }
    } catch (e) {
        console.warn("Failed to parse saved custom extensions:", e);
    }

    // Generate a unique SHA hash using the Web Crypto API
    const hashInput = `${Math.random().toString(36).substring(2, 15)}${Date.now()}`;
    const encoder = new TextEncoder();
    const dataToHash = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("SHA-1", dataToHash);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const id = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const newExtension = {
        id,
        name,
        description,
    };

    if (options.jsText) {
        const base64 = btoa(unescape(encodeURIComponent(options.jsText)));
        newExtension.base64 = base64;
    } else if (options.uri) {
        newExtension.uri = options.uri;
    }

    data.extensions.push(newExtension);
    localStorage[key] = JSON.stringify(data);
};

/**
 * @param {Blob} blob Blob
 * @returns {Promise<string>} data: uri
 */
const readAsDataURL = blob =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () =>
            reject(
                new Error(
                    `Could not read extension as data URL: ${reader.error}`
                )
            );
        reader.readAsDataURL(blob);
    });

class CustomExtensionModal extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            "handleChangeFiles",
            "handleChangeURL",
            "handleClose",
            "handleKeyDown",
            "handleLoadExtension",
            "handleSwitchToFile",
            "handleSwitchToURL",
            "handleSwitchToText",
            "handleChangeText",
            "handleDragOver",
            "handleDragLeave",
            "handleDrop",
            "handleChangeUnsandboxed",
        ]);

        this.state = {
            type: "url",
            url: "",
            files: null,
            text: "",
            unsandboxed: getPersistedUnsandboxed(),
        };
    }

    /**
     * @returns {Promise<string[]>} List of extension URLs to load.
     */
    getExtensionURLs() {
        if (this.state.type === "url") {
            return Promise.resolve([this.state.url]);
        }

        if (this.state.type === "file") {
            const files = Array.from(this.state.files);
            return Promise.all(files.map(readAsDataURL));
        }

        if (this.state.type === "text") {
            return Promise.resolve([
                `data:application/javascript;base64,${btoa(unescape(this.state.text))}`,
            ]);
        }

        return Promise.reject(new Error("Unknown type"));
    }

    hasValidInput() {
        if (this.state.type === "url") {
            try {
                const parsed = new URL(this.state.url);
                return (
                    parsed.protocol === "https:" ||
                    parsed.protocol === "http:" ||
                    parsed.protocol === "data:"
                );
            } catch (e) {
                return false;
            }
        }

        if (this.state.type === "file") {
            return !!this.state.files;
        }

        if (this.state.type === "text") {
            return !!this.state.text;
        }

        return false;
    }

    handleChangeFiles(files) {
        this.setState({
            files,
        });
    }

    handleChangeURL(e) {
        this.setState({
            url: e.target.value,
        });
    }

    handleClose() {
        this.props.onClose();
    }

    handleKeyDown(e) {
        if (e.key === "Enter" && this.hasValidInput()) {
            e.preventDefault();
            this.handleLoadExtension();
        }
    }

    async handleLoadExtension(extraOptions = {}) {
        this.handleClose();
        try {
            const urls = await this.getExtensionURLs();

            if (this.state.type !== "url") {
                setPersistedUnsandboxed(this.state.unsandboxed);
                if (this.state.unsandboxed) {
                    for (const url of urls) {
                        manuallyTrustExtension(url);
                    }
                }
            }

            for (const url of urls) {
                await this.props.vm.extensionManager.loadExtensionURL(url);
            }

            const { saveToLocalStorage, saveName, saveDescription } =
                extraOptions;

            if (saveToLocalStorage && saveName && saveDescription) {
                if (this.state.type === "text") {
                    saveExtensionToLocalStorage(saveName, saveDescription, {
                        jsText: this.state.text,
                    });
                } else if (this.state.type === "url") {
                    saveExtensionToLocalStorage(saveName, saveDescription, {
                        uri: this.state.url,
                    });
                } else if (this.state.type === "file") {
                    const files = Array.from(this.state.files);
                    for (const file of files) {
                        const text = await file.text();
                        saveExtensionToLocalStorage(saveName, saveDescription, {
                            jsText: text,
                        });
                    }
                }
            }
        } catch (err) {
            log.error(err);
            alert(err);
        }
    }

    handleSwitchToFile() {
        this.setState({
            type: "file",
        });
    }

    handleSwitchToURL() {
        this.setState({
            type: "url",
        });
    }

    handleSwitchToText() {
        this.setState({
            type: "text",
        });
    }

    handleChangeText(e) {
        this.setState({
            text: e.target.value,
        });
    }

    handleDragOver(e) {
        if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        }
    }

    handleDragLeave() {}

    handleDrop(e) {
        const files = e.dataTransfer.files;
        if (files.length) {
            e.preventDefault();
            this.setState({
                type: "file",
                files,
            });
        }
    }

    isUnsandboxed() {
        if (this.state.type === "url") {
            return isTrustedExtension(this.state.url) || this.state.unsandboxed;
        }
        return this.state.unsandboxed;
    }

    canChangeUnsandboxed() {
        return true;
    }

    handleChangeUnsandboxed(e) {
        this.setState({
            unsandboxed: e.target.checked,
        });
    }

    render() {
        return (
            <CustomExtensionModalComponent
                canLoadExtension={this.hasValidInput()}
                type={this.state.type}
                onSwitchToFile={this.handleSwitchToFile}
                onSwitchToURL={this.handleSwitchToURL}
                onSwitchToText={this.handleSwitchToText}
                files={this.state.files}
                onChangeFiles={this.handleChangeFiles}
                onDragOver={this.handleDragOver}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                url={this.state.url}
                onChangeURL={this.handleChangeURL}
                onKeyDown={this.handleKeyDown}
                text={this.state.text}
                onChangeText={this.handleChangeText}
                unsandboxed={this.isUnsandboxed()}
                onChangeUnsandboxed={
                    this.canChangeUnsandboxed()
                        ? this.handleChangeUnsandboxed
                        : null
                }
                onLoadExtension={this.handleLoadExtension}
                onClose={this.handleClose}
            />
        );
    }
}

CustomExtensionModal.propTypes = {
    onClose: PropTypes.func,
    vm: PropTypes.shape({
        extensionManager: PropTypes.shape({
            loadExtensionURL: PropTypes.func,
        }),
    }),
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeCustomExtensionModal()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomExtensionModal);

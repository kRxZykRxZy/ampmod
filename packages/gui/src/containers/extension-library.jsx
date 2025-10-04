import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import VM from "scratch-vm";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import log from "../lib/log";

import extensionLibraryContent, {
    galleryError,
    galleryLoading,
    galleryMore,
} from "../lib/libraries/extensions/index.jsx";
import extensionTags from "../lib/libraries/tw-extension-tags";

import LibraryComponent from "../components/library/library.jsx";
import extensionIcon from "../components/action-menu/icon--sprite.svg";
import localExtensionIcon from "../lib/libraries/extensions/local/local.svg";

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: "Choose an Extension",
        description: "Heading for the extension library",
        id: "gui.extensionLibrary.chooseAnExtension",
    },
});

const toLibraryItem = extension => {
    if (typeof extension === "object") {
        return {
            rawURL: extension.iconURL || extensionIcon,
            ...extension,
        };
    }
    return extension;
};

const translateGalleryItem = (extension, locale) => ({
    ...extension,
    name: extension.nameTranslations[locale] || extension.name,
    description:
        extension.descriptionTranslations[locale] || extension.description,
});

let cachedGallery = null;

const fetchLibrary = async () => {
    const res = await fetch(
        "https://ampmod.codeberg.page/extensions/generated-metadata/extensions-v0.json"
    );
    if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
    }
    const data = await res.json();
    return data.extensions.map(extension => ({
        name: extension.name,
        nameTranslations: extension.nameTranslations || {},
        description:
            extension.deprecated == extension.description
                ? null
                : extension.description,
        descriptionTranslations: extension.descriptionTranslations || {},
        extensionId: extension.id,
        extensionURL: `https://ampmod.codeberg.page/extensions/${extension.slug}.js`,
        iconURL: `https://ampmod.codeberg.page/extensions/${extension.image || "images/unknown.svg"}`,
        tags: [
            ...(extension.isAmpMod ? ["ampmod"] : ["tw"]),
            ...(extension.tags || []),
        ],
        deprecated: extension.deprecated,
        credits: [...(extension.original || []), ...(extension.by || [])].map(
            credit => {
                if (credit.link) {
                    return (
                        <a
                            href={credit.link}
                            target="_blank"
                            rel="noreferrer"
                            key={credit.name}
                        >
                            {credit.name}
                        </a>
                    );
                }
                return credit.name;
            }
        ),
        docsURI: extension.docs
            ? `https://ampmod.codeberg.page/extensions/${extension.slug}`
            : null,
        samples: extension.samples
            ? extension.samples.map(sample => ({
                  href: `${process.env.ROOT}editor.html?project_url=https://ampmod.codeberg.page/extensions/samples/${encodeURIComponent(sample)}`,
                  text: sample,
              }))
            : null,
        incompatibleWithScratch: !extension.scratchCompatible,
        featured: true,
    }));
};

const parseExtLocalStorage = async () => {
    const raw =
        localStorage[
            `${process.env.ampmod_is_canary ? "canary" : "amp"}:saved-custom-extensions`
        ];

    if (!raw) return [];

    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        console.error("Invalid JSON in saved-custom-extensions:", e);
        return [];
    }

    if (!Array.isArray(data.extensions)) {
        console.error("Expected 'extensions' to be an array.");
        return [];
    }

    return data.extensions
        .map(extension => {
            if (extension.uri) {
                return {
                    extensionId: `local_${extension.id}`,
                    iconURL: localExtensionIcon,
                    name: extension.name,
                    description: extension.description,
                    extensionURL: extension.uri,
                    tags: ["localStorage"],
                    featured: true,
                };
            } else if (extension.base64) {
                return {
                    extensionId: `saved_to_local_${extension.id}`,
                    iconURL: localExtensionIcon,
                    name: extension.name,
                    description: extension.description,
                    extensionURL: `data:application/javascript;base64,${extension.base64}`,
                    tags: ["localStorage"],
                    featured: true,
                };
            }
            return null;
        })
        .filter(Boolean);
};

class ExtensionLibrary extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, ["handleItemSelect"]);
        this.state = {
            gallery: cachedGallery,
            galleryError: null,
            galleryTimedOut: false,
            savedCustomExtensions: [], // added state for custom extensions
        };
    }
    componentDidMount() {
        if (!this.state.gallery) {
            const timeout = setTimeout(() => {
                this.setState({
                    galleryTimedOut: true,
                });
            }, 750);

            fetchLibrary()
                .then(gallery => {
                    cachedGallery = gallery;
                    this.setState({
                        gallery,
                    });
                    clearTimeout(timeout);
                })
                .catch(error => {
                    log.error(error);
                    this.setState({
                        galleryError: error,
                    });
                    clearTimeout(timeout);
                });
        }

        // Load saved custom extensions
        parseExtLocalStorage()
            .then(savedCustomExtensions => {
                this.setState({ savedCustomExtensions });
            })
            .catch(e => {
                console.warn("Failed to parse saved custom extensions", e);
            });
    }
    handleItemSelect(item) {
        if (item.href) {
            return;
        }

        const extensionId = item.extensionId;

        if (extensionId === "custom_extension") {
            this.props.onOpenCustomExtensionModal();
            return;
        }

        if (extensionId === "procedures_enable_return") {
            this.props.onEnableProcedureReturns();
            this.props.onCategorySelected("myBlocks");
            return;
        }

        if (extensionId === "data_enable_lists") {
            this.props.onEnableLegacyLists();
            this.props.onCategorySelected("variables");
            return;
        }

        const url = item.extensionURL ? item.extensionURL : extensionId;
        if (!item.disabled) {
            if (this.props.vm.extensionManager.isExtensionLoaded(extensionId)) {
                this.props.onCategorySelected(extensionId);
            } else {
                this.props.vm.extensionManager
                    .loadExtensionURL(url)
                    .then(() => {
                        this.props.onCategorySelected(extensionId);
                    })
                    .catch(err => {
                        log.error(err);
                        // eslint-disable-next-line no-alert
                        alert(err);
                    });
            }
        }
    }
    render() {
        let library = extensionLibraryContent.map(toLibraryItem);
        library.push("---");

        // Add saved custom extensions from state
        if (this.state.savedCustomExtensions.length > 0) {
            library.push(
                ...this.state.savedCustomExtensions.map(toLibraryItem)
            );
            library.push("---");
        }

        // Add gallery extensions or loading/error indicators
        if (this.state.gallery) {
            library.push(toLibraryItem(galleryMore));
            const locale = this.props.intl.locale;
            library.push(
                ...this.state.gallery
                    .map(i => translateGalleryItem(i, locale))
                    .map(toLibraryItem)
            );
        } else if (this.state.galleryError) {
            library.push(toLibraryItem(galleryError));
        } else if (this.state.galleryTimedOut) {
            library.push(toLibraryItem(galleryLoading));
        }

        return (
            <LibraryComponent
                data={library}
                filterable
                persistableKey="extensionId"
                id="extensionLibrary"
                noFaceSensing
                tags={extensionTags}
                title={this.props.intl.formatMessage(messages.extensionTitle)}
                visible={this.props.visible}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

ExtensionLibrary.propTypes = {
    intl: intlShape.isRequired,
    onCategorySelected: PropTypes.func,
    onEnableProcedureReturns: PropTypes.func,
    onEnableLegacyLists: PropTypes.func,
    onOpenCustomExtensionModal: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired, // eslint-disable-line react/no-unused-prop-types
};

export default injectIntl(ExtensionLibrary);

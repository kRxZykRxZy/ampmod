import PropTypes from "prop-types";
import React from "react";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import bindAll from "lodash.bindall";
import { connect } from "react-redux";
import { closeSettingsModal } from "../reducers/modals";
import SettingsModalComponent from "../components/tw-settings-modal/settings-modal.jsx";
import { defaultStageSize } from "../reducers/custom-stage-size";

const messages = defineMessages({
    newFramerate: {
        defaultMessage: "New framerate:",
        description: "Prompt shown to choose a new framerate",
        id: "tw.menuBar.newFramerate",
    },
});

class UsernameModal extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            "handleFramerateChange",
            "handleCustomizeFramerate",
            "handleHighQualityPenChange",
            "handleInterpolationChange",
            "handleInfiniteClonesChange",
            "handleRemoveFencingChange",
            "handleRemoveLimitsChange",
            "handleWarpTimerChange",
            "handleStageWidthChange",
            "handleStageHeightChange",
            "handleDisableCompilerChange",
            "handleDisableSecmanChange",
            "handleStoreProjectOptions",
        ]);
    }

    handleFramerateChange(e) {
        this.props.vm.setFramerate(e.target.checked ? 60 : 30);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    async handleCustomizeFramerate() {
        // prompt() returns Promise in desktop app
        // eslint-disable-next-line no-alert
        const newFramerate = await prompt(
            this.props.intl.formatMessage(messages.newFramerate),
            this.props.framerate
        );
        const parsed = parseFloat(newFramerate);
        if (isFinite(parsed)) {
            this.props.vm.setFramerate(parsed);
            if (!this.props.isEmbedded) this.handleStoreProjectOptions();
        }
    }

    handleHighQualityPenChange(e) {
        this.props.vm.renderer.setUseHighQualityRender(e.target.checked);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleInterpolationChange(e) {
        this.props.vm.setInterpolation(e.target.checked);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleInfiniteClonesChange(e) {
        this.props.vm.setRuntimeOptions({
            maxClones: e.target.checked ? Infinity : 300,
        });
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleRemoveFencingChange(e) {
        this.props.vm.setRuntimeOptions({
            fencing: !e.target.checked,
        });
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleRemoveLimitsChange(e) {
        this.props.vm.setRuntimeOptions({
            miscLimits: !e.target.checked,
        });
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleWarpTimerChange(e) {
        this.props.vm.setCompilerOptions({
            warpTimer: e.target.checked,
        });
        // Do not store automatically
    }

    handleDisableCompilerChange(e) {
        this.props.vm.setCompilerOptions({
            enabled: !e.target.checked,
        });
        // Do not store automatically
    }

    handleDisableSecmanChange(e) {
        // eslint-disable-next-line max-len
        if (
            !e.target.checked ||
            confirm(
                'This *dangerous* option allows potentially malicious third-party extensions to corrupt your project, phish for passwords, install malware, and more.\n\nDo not blindly enable this. The prompts may look annoying, but they will prevent malicious projects from going undercover.\n\nIf you don\'t understand what "security" means, you should not enable this option.'
            )
        ) {
            this.props.vm.setRuntimeOptions({
                secman: !e.target.checked,
            });
        }
        // Do not store automatically
    }

    handleStageWidthChange(value) {
        this.props.vm.setStageSize(value, this.props.customStageSize.height);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleStageHeightChange(value) {
        this.props.vm.setStageSize(this.props.customStageSize.width, value);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleStoreProjectOptions() {
        this.props.vm.storeProjectOptions();
    }

    render() {
        const {
            /* eslint-disable no-unused-vars */
            onClose,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return (
            <SettingsModalComponent
                onClose={this.props.onClose}
                onFramerateChange={this.handleFramerateChange}
                onCustomizeFramerate={this.handleCustomizeFramerate}
                onHighQualityPenChange={this.handleHighQualityPenChange}
                onInterpolationChange={this.handleInterpolationChange}
                onInfiniteClonesChange={this.handleInfiniteClonesChange}
                onRemoveFencingChange={this.handleRemoveFencingChange}
                onRemoveLimitsChange={this.handleRemoveLimitsChange}
                onWarpTimerChange={this.handleWarpTimerChange}
                onStageWidthChange={this.handleStageWidthChange}
                onStageHeightChange={this.handleStageHeightChange}
                onDisableCompilerChange={this.handleDisableCompilerChange}
                onDisableSecmanChange={this.handleDisableSecmanChange}
                stageWidth={this.props.customStageSize.width}
                stageHeight={this.props.customStageSize.height}
                customStageSizeEnabled={
                    this.props.customStageSize.width !==
                        defaultStageSize.width ||
                    this.props.customStageSize.height !==
                        defaultStageSize.height
                }
                onStoreProjectOptions={this.handleStoreProjectOptions}
                {...props}
            />
        );
    }
}

UsernameModal.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func,
    vm: PropTypes.shape({
        renderer: PropTypes.shape({
            setUseHighQualityRender: PropTypes.func,
        }),
        setFramerate: PropTypes.func,
        setCompilerOptions: PropTypes.func,
        setInterpolation: PropTypes.func,
        setRuntimeOptions: PropTypes.func,
        setStageSize: PropTypes.func,
        storeProjectOptions: PropTypes.func,
    }),
    isEmbedded: PropTypes.bool,
    framerate: PropTypes.number,
    highQualityPen: PropTypes.bool,
    interpolation: PropTypes.bool,
    infiniteClones: PropTypes.bool,
    removeFencing: PropTypes.bool,
    removeLimits: PropTypes.bool,
    warpTimer: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    disableCompiler: PropTypes.bool,
    disableSecman: PropTypes.bool,
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    isEmbedded: state.scratchGui.mode.isEmbedded,
    framerate: state.scratchGui.tw.framerate,
    highQualityPen: state.scratchGui.tw.highQualityPen,
    interpolation: state.scratchGui.tw.interpolation,
    infiniteClones: state.scratchGui.tw.runtimeOptions.maxClones === Infinity,
    removeFencing: !state.scratchGui.tw.runtimeOptions.fencing,
    removeLimits: !state.scratchGui.tw.runtimeOptions.miscLimits,
    warpTimer: state.scratchGui.tw.compilerOptions.warpTimer,
    customStageSize: state.scratchGui.customStageSize,
    disableCompiler: !state.scratchGui.tw.compilerOptions.enabled,
    disableSecman: !state.scratchGui.tw.runtimeOptions.secman,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeSettingsModal()),
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(UsernameModal)
);

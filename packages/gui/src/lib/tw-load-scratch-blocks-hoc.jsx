import React from 'react';
import log from './log';
import LazyScratchBlocks from './tw-lazy-scratch-blocks';
import LoadingSpinner from '../components/tw-loading-spinner/spinner.jsx';
import CrashMessage from '../components/crash-message/crash-message.jsx';

const LoadScratchBlocksHOC = function (WrappedComponent) {
    class LoadScratchBlocks extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                loaded: LazyScratchBlocks.isLoaded(),
                fontLoaded: document.fonts ? document.fonts.check('1em "Inter Variable"') : true,
                error: null
            };
        }

        componentDidMount() {
            const promises = [];
            const urlParams = new URLSearchParams(window.location.search);
            const delayLazyBlocks = urlParams.has('delaylazyblocks');

            // Wait for "Inter Variable" font
            if (!this.state.fontLoaded && document.fonts) {
                promises.push(
                    document.fonts
                        .load('1em "Inter Variable"')
                        .then(() => this.setState({fontLoaded: true}))
                        .catch(e => {
                            log.warn('Font load failed:', e);
                            this.setState({fontLoaded: true}); // fallback
                        })
                );
            }

            // Load scratch-blocks if not yet loaded
            if (!this.state.loaded) {
                const loadPromise = (async () => {
                    if (delayLazyBlocks) {
                        await new Promise(res => setTimeout(res, 2000));
                    }
                    await LazyScratchBlocks.load();
                    this.setState({loaded: true});
                })();

                promises.push(loadPromise);
            }

            Promise.all(promises).catch(e => {
                log.error(e);
                this.setState({error: e});
            });
        }

        handleReload() {
            location.reload();
        }

        render() {
            const {error, loaded, fontLoaded} = this.state;

            if (error) {
                return <CrashMessage errorMessage={`lazy scratch-blocks: ${error}`} onReload={this.handleReload} />;
            }

            if (!loaded || !fontLoaded) {
                return <LoadingSpinner />;
            }

            return <WrappedComponent {...this.props} />;
        }
    }

    return LoadScratchBlocks;
};

export default LoadScratchBlocksHOC;

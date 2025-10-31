import {guiColors as greenColors} from './green';

const guiColors = {
    ...greenColors,

    'menu-bar-background-image-classic':
        // eslint-disable-next-line max-len
        'linear-gradient(90deg, rgba(255, 0, 0, 0.75) 0%, rgba(255, 154, 0, 0.75) 10%, rgba(208, 222, 33, 0.75) 20%, rgba(79, 220, 74, 0.75) 30%, rgba(63, 218, 216, 0.75) 40%, rgba(47, 201, 226, 0.75) 50%, rgba(28, 127, 238, 0.75) 60%, rgba(95, 21, 242, 0.75) 70%, rgba(186, 12, 248, 0.75) 80%, rgba(251, 7, 217, 0.75) 90%, rgba(255, 0, 0, 0.75) 100%)',
    'menu-bar-background-image-modern':
        // eslint-disable-next-line max-len
        'linear-gradient(90deg, rgba(255,0,0,0.35) 0%, rgba(255,154,0,0.35) 10%, rgba(208,222,33,0.35) 20%, rgba(79,220,74,0.35) 30%, rgba(63,218,216,0.35) 40%, rgba(47,201,226,0.35) 50%, rgba(28,127,238,0.35) 60%, rgba(95,21,242,0.35) 70%, rgba(186,12,248,0.35) 80%, rgba(251,7,217,0.35) 90%, rgba(255,0,0,0.35) 100%)'
};

const blockColors = {
    checkboxActiveBackground: '#ff4c4c',
    checkboxActiveBorder: '#cc3333'
};

export {guiColors, blockColors};

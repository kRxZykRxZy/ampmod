import { APP_NAME } from '@ampmod/branding';

export default [
    // Categorise extensions by their origin.
    {
        heading: {
            id: 'amp.extensions.heading.source',
            defaultMessage: 'Source'
        }
    },

    {
        tag: 'scratch',
        intlLabel: {
            id: 'amp.extensions.fromScratch',
            defaultMessage: 'From Scratch'
        }
    },

    {
        tag: 'tw',
        intlLabel: {
            id: 'amp.extensions.fromTw',
            defaultMessage: 'From TurboWarp'
        }
    },

    {
        tag: 'ampmod',
        intlLabel: {
            id: 'amp.extensions.fromAmpmod',
            defaultMessage: 'From {APP_NAME}',
            values: { APP_NAME }
        }
    },

    {
        tag: 'localStorage',
        intlLabel: {
            id: 'amp.extensions.local',
            defaultMessage: 'Locally saved'
        }
    },

    '---',

    // Categorize extensions by type.
    {
        heading: {
            id: 'amp.extensions.heading.categories',
            defaultMessage: 'Categories'
        }
    },

    {
        tag: 'internet',
        intlLabel: {
            id: 'amp.extensions.internet',
            defaultMessage: 'Internet'
        }
    },

    {
        tag: 'graphics',
        intlLabel: {
            id: 'amp.extensions.graphics',
            defaultMessage: 'Graphics'
        }
    },

    {
        tag: 'sound',
        intlLabel: {
            id: 'amp.extensions.sound',
            defaultMessage: 'Sound'
        }
    },

    {
        tag: 'math',
        intlLabel: {
            id: 'amp.extensions.math',
            defaultMessage: 'Math'
        }
    },

    {
        tag: 'data',
        intlLabel: {
            id: 'amp.extensions.data',
            defaultMessage: 'Data management'
        }
    },

    {
       	tag: 'catexp',
        intlLabel: {
            id: 'amp.extensions.catexp',
            defaultMessage: 'Category expansions'
        }
    },

    {
        tag: 'hardware',
        intlLabel: {
            id: 'amp.extensions.hardware',
            defaultMessage: 'Hardware'
        }
    }
];

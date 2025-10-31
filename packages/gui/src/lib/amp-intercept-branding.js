import branding from 'real-branding';
import {localise} from '../website/components/localise/localise.jsx';

export const APP_SLOGAN = localise('appSlogan', {
    APP_NAME: branding.APP_NAME
});
export const APP_DESCRIPTION = localise('appShortDescription', {
    APP_NAME: branding.APP_NAME
});

// Leave these unchanged
export const APP_NAME = branding.APP_NAME;
export const APP_WEBSITE = branding.APP_WEBSITE;
export const APP_SOURCE = branding.APP_SOURCE;
export const APP_CONTACT = branding.APP_CONTACT;
export const APP_WIKI = branding.APP_WIKI;
export const APP_FORUMS = branding.APP_FORUMS;
export const APP_BLOG = branding.APP_BLOG;
export const APP_FORUMS_BUGS = branding.APP_FORUMS_BUGS;

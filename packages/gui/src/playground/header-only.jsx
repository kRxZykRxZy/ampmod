import './import-first';
import React from 'react';
import render, {renderToBottom} from './app-target';

import {applyGuiColors} from '../lib/themes/guiHelpers';
import {detectTheme} from '../lib/themes/themePersistance';

import Header from '../components/amp-header/header';
import Footer from '../components/amp-footer/footer';

 

applyGuiColors(detectTheme());
document.documentElement.lang = 'en';

render(<Header />);
renderToBottom(<Footer />);

import React from 'react';
import ReactDOM from 'react-dom';
import {ExamplesPage} from 'scratch-gui/src/website/examples/examples.jsx';

const appTarget = document.getElementById('app');
document.body.classList.add('tw-loaded');

ReactDOM.render(<ExamplesPage />, appTarget);

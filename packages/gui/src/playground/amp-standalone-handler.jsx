/*!
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import './import-first.js';

import React from 'react';

import Interface from './render-interface.jsx';
import AddonSettings from '../addons/settings/settings.jsx';
import Clippy from '../containers/amp-clippy.jsx';
import render from './app-target.js';

const onExportSettings = settings => {
    const blob = new Blob([JSON.stringify(settings)]);
    downloadBlob('turbowarp-addon-settings.json', blob);
};

const urlParams = new URLSearchParams(location.search);
if (urlParams.has('addon-settings')) {
    render(
        <React.Fragment>
            <Clippy isFixed />
            <AddonSettings onExportSettings={onExportSettings} />
        </React.Fragment>
    );
} else {
    render(<Interface />);
}
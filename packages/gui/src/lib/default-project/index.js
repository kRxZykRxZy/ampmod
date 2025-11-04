import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import overrideDefaultProject from './override-default-project.sb3?bytes';
import backdrop from './cd21514d0531fdffb22204e0ec5ed84a.svg?raw';
import costume1 from './applecat.svg?raw';
/* eslint-enable import/no-unresolved */
import {TextEncoder} from '../tw-text-encoder';

const defaultProject = translator => {
    if (overrideDefaultProject.byteLength > 0) {
        return [
            {
                id: 0,
                assetType: 'Project',
                dataFormat: 'JSON',
                data: overrideDefaultProject
            }
        ];
    }

    let _TextEncoder;
    if (typeof TextEncoder === 'undefined') {
        _TextEncoder = require('text-encoding').TextEncoder;
    } else {
        _TextEncoder = TextEncoder;
    }
    const encoder = new _TextEncoder();

    const projectJson = projectData(translator);
    return [
        {
            id: 0,
            assetType: 'Project',
            dataFormat: 'JSON',
            data: JSON.stringify(projectJson)
        },
        {
            id: 'cd21514d0531fdffb22204e0ec5ed84a',
            assetType: 'ImageVector',
            dataFormat: 'SVG',
            data: encoder.encode(backdrop)
        },
        {
            id: '1fe66020da00ba6c793c45d652e6b9cd',
            assetType: 'ImageVector',
            dataFormat: 'SVG',
            data: encoder.encode(costume1)
        }
    ];
};

export default defaultProject;

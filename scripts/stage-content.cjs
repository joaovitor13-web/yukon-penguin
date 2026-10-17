const fs = require('node:fs');
const path = require('node:path');

function addStage(root, out, crumbs) {
    const source = path.join(root, 'resources/stage/media');
    if (!fs.existsSync(path.join(source, 'rooms/stage/stage-basic/stage-basic-pack.json'))) {
        throw new Error('Pack da sala Stage ausente em resources/stage/.');
    }
    fs.cpSync(source, path.join(out, 'assets/media'), { recursive: true });
    crumbs.rooms['340'] = { key: 'Stage', path: 'stage/Stage', x: 157, y: 655 };
}
module.exports = { addStage };

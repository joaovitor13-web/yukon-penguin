const fs = require('node:fs');
const path = require('node:path');

function addMine(root, out, crumbs) {
    const room = path.join(root, 'resources/mine/media');
    if (!fs.existsSync(path.join(room, 'rooms/mine/mine-pack.json'))) {
        throw new Error('Pack da sala Mine ausente em resources/mine/.');
    }
    fs.cpSync(room, path.join(out, 'assets/media'), { recursive: true });
    crumbs.rooms['808'] = { key: 'Mine', path: 'mine/Mine', x: 760, y: 500 };
    // A chave "mine" não tem textos de prompt, carregamento nem busca de amigos; "cart" tem.
    if (crumbs.games['905']) crumbs.games['905'].key = 'cart';
}
module.exports = { addMine };

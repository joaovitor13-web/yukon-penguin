const fs = require('node:fs');
const path = require('node:path');

function addPizzatron(root, out, crumbs) {
    const source = path.join(root, 'resources/pizzatron/media');
    if (!fs.existsSync(path.join(source, 'flash/games/pizzatron/game.swf'))) {
        throw new Error('Pacote Pizzatron ausente em resources/pizzatron/.');
    }
    const room = path.join(root, 'resources/pizza/media');
    if (!fs.existsSync(path.join(room, 'rooms/pizza/pizza-pack.json'))) {
        throw new Error('Pack da sala Pizza ausente em resources/pizza/.');
    }
    fs.cpSync(source, path.join(out, 'assets/media'), { recursive: true });
    fs.cpSync(room, path.join(out, 'assets/media'), { recursive: true });
    crumbs.rooms['330'] = { key: 'Pizza', path: 'pizza/Pizza', x: 827, y: 502 };
    crumbs.games['910'] = { key: 'pizzatron', path: 'pizzatron/game.swf' };
    // A trilha do minijogo está embutida no SWF.
    const dir = path.join(out, 'assets/media/crumbs/en');
    for (const key of ['rooms', 'games']) {
        fs.writeFileSync(path.join(dir, `${key}.json`), JSON.stringify(crumbs[key]));
    }
}
module.exports = { addPizzatron };

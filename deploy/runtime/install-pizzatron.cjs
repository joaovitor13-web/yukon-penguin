const fs = require('node:fs');
const path = require('node:path');
const { rooms: pizzatronRooms } = require('./pizzatron.cjs');
const { rooms: localRooms } = require('./local-rooms.cjs');

const rooms = [...pizzatronRooms, ...localRooms];

function install(root) {
    const file = path.join(root, 'data/rooms.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const room of rooms) {
        const existing = data.find(r => r.id === room.id);
        if (existing && existing.name !== room.name) throw new Error(`Sala ${room.id} já está em uso.`);
        if (!existing) data.push(room);
    }
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
    const replace = (relative, marker, replacement) => {
        const file = path.join(root, relative);
        const source = fs.readFileSync(file, 'utf8');
        if (source.includes(replacement)) return;
        if (!source.includes(marker)) throw new Error(`Servidor incompatível: ${relative}`);
        fs.writeFileSync(file, source.replace(marker, replacement));
    };
    replace('src/plugin/plugins/game/MiniGame.js', "import GamePlugin from '@plugin/GamePlugin'", "import GamePlugin from '@plugin/GamePlugin'\nimport { claimPizzatronReward } from '../../../../local/pizzatron.cjs'");
    replace('src/plugin/plugins/game/MiniGame.js', '    gameOver(args, user) {', `    gameOver(args, user) {
        if (user.room?.id === 910 && !claimPizzatronReward(user, args.coins)) return`);
    replace('src/objects/user/GameUser.js', '        this.room = room', '        this.pizzatronClaimed = false\n        this.room = room');
}
module.exports = { install };
if (require.main === module) install(process.cwd());

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { createHash } = require('node:crypto');
const { rooms, claimPizzatronReward } = require('../deploy/runtime/pizzatron.cjs');
const { install } = require('../deploy/runtime/install-pizzatron.cjs');

test('Pizzatron só concede uma recompensa válida por entrada no jogo', () => {
    const user = { room: { id: 330 } };
    assert.equal(claimPizzatronReward(user, 10), false);
    user.room.id = 910;
    for (const coins of [-1, 2001, 1.5, '100', null, NaN]) assert.equal(claimPizzatronReward(user, coins), false);
    assert.equal(claimPizzatronReward(user, 100), true);
    assert.equal(claimPizzatronReward(user, 100), false);
    user.pizzatronClaimed = false;
    assert.equal(claimPizzatronReward(user, 0), true);
});

test('instalação adiciona salas e proteção de moedas sem alterar o submódulo', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'yukon-pizzatron-'));
    try {
        for (const file of ['data/rooms.json', 'src/plugin/plugins/game/MiniGame.js', 'src/objects/user/GameUser.js']) {
            const dest = path.join(root, file);
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(path.join(__dirname, '../server', file), dest);
        }
        install(root);
        install(root);
        const installed = JSON.parse(fs.readFileSync(path.join(root, 'data/rooms.json')));
        for (const room of rooms) assert.deepEqual(installed.filter(r => r.id === room.id), [room]);
        assert.match(fs.readFileSync(path.join(root, 'src/plugin/plugins/game/MiniGame.js'), 'utf8'), /claimPizzatronReward\(user, args.coins\)/);
        assert.match(fs.readFileSync(path.join(root, 'src/objects/user/GameUser.js'), 'utf8'), /pizzatronClaimed = false/);
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('arquivos do pacote Pizzatron correspondem ao manifesto SHA-256', () => {
    const root = path.join(__dirname, '../resources/pizzatron');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json')));
    for (const entry of manifest.files) {
        const bytes = fs.readFileSync(path.join(root, entry.path));
        assert.equal(bytes.length, entry.bytes, entry.path);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, entry.path);
        assert.ok(['CWS', 'FWS'].includes(bytes.subarray(0, 3).toString()), entry.path);
    }
});

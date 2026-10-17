const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { createHash } = require('node:crypto');
const { rooms, claimPizzatronReward } = require('../deploy/runtime/pizzatron.cjs');
const { install } = require('../deploy/runtime/install-pizzatron.cjs');
const { rooms: localRooms } = require('../deploy/runtime/local-rooms.cjs');
const { rooms: mineRooms } = require('../deploy/runtime/mine.cjs');

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
        for (const room of [...rooms, ...localRooms, ...mineRooms]) assert.deepEqual(installed.filter(r => r.id === room.id), [room]);
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

test('pack original da sala Pizza corresponde ao manifesto e às referências', () => {
    const root = path.join(__dirname, '../resources/pizza');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json')));
    for (const entry of manifest.files) {
        const bytes = fs.readFileSync(path.join(root, entry.path));
        assert.equal(bytes.length, entry.bytes, entry.path);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, entry.path);
    }
    const dir = path.join(root, 'media/rooms/pizza');
    const pack = JSON.parse(fs.readFileSync(path.join(dir, 'pizza-pack.json')));
    for (const file of pack.section1.files) {
        assert.ok(fs.existsSync(path.join(root, file.url.replace('assets/', ''))), file.url);
    }
    const atlas = JSON.parse(fs.readFileSync(path.join(dir, 'pizza.json')));
    const frames = new Set(atlas.textures.flatMap(t => t.frames.map(f => f.filename)));
    const scene = fs.readFileSync(path.join(__dirname, '../src/scenes/rooms/pizza/Pizza.js'), 'utf8');
    for (const [, frame] of scene.matchAll(/(?:'pizza', |scaled\([^']*)'([^']+)'/g)) assert.ok(frames.has(frame), frame);
    for (const frame of ['smoke0005', 'fire0008', 'candle-fire10014', 'book-hover0016', 'register0042']) assert.ok(frames.has(frame), frame);
    const physics = JSON.parse(fs.readFileSync(path.join(dir, 'pizza-physics.json')));
    for (const key of ['block', 'plaza', 'pizzatron']) assert.ok(physics[key], key);
});

test('pack original da sala Mine corresponde ao manifesto e às referências', () => {
    const root = path.join(__dirname, '../resources/mine');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json')));
    for (const entry of manifest.files) {
        const bytes = fs.readFileSync(path.join(root, entry.path));
        assert.equal(bytes.length, entry.bytes, entry.path);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, entry.path);
    }
    const dir = path.join(root, 'media/rooms/mine');
    const pack = JSON.parse(fs.readFileSync(path.join(dir, 'mine-pack.json')));
    for (const file of pack.section1.files) {
        for (const url of [file.url].flat()) assert.ok(fs.existsSync(path.join(root, url.replace('assets/', ''))), url);
    }
    const atlas = JSON.parse(fs.readFileSync(path.join(dir, 'mine.json')));
    for (const texture of atlas.textures) assert.ok(fs.existsSync(path.join(dir, texture.image)), texture.image);
    const frames = new Set(atlas.textures.flatMap(t => t.frames.map(f => f.filename)));
    const scene = fs.readFileSync(path.join(__dirname, '../src/scenes/rooms/mine/Mine.js'), 'utf8');
    for (const [, frame] of scene.matchAll(/'mine', '([^']+)'/g)) assert.ok(frames.has(frame), frame);
    for (const [, key, end] of scene.matchAll(/animate\([^,]+, '([^']+)', (\d+)/g)) {
        assert.ok(frames.has(`${key}${end.padStart(4, '0')}`), `${key} ${end}`);
    }
    const physics = JSON.parse(fs.readFileSync(path.join(dir, 'mine-physics.json')));
    for (const key of ['block', 'cave', 'cart', 'cavemine', 'rescue']) assert.ok(physics[key], key);
});

test('pack original do teatro corresponde ao manifesto e às referências da cena', () => {
    const root = path.join(__dirname, '../resources/stage');
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json')));
    for (const entry of manifest.files) {
        const bytes = fs.readFileSync(path.join(root, entry.path));
        assert.equal(bytes.length, entry.bytes, entry.path);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, entry.path);
    }
    const dir = path.join(root, 'media/rooms/stage/stage-basic');
    const pack = JSON.parse(fs.readFileSync(path.join(dir, 'stage-basic-pack.json')));
    for (const file of pack.section1.files) {
        assert.ok(fs.existsSync(path.join(root, file.url.replace('assets/', ''))), file.url);
    }
    const atlas = JSON.parse(fs.readFileSync(path.join(dir, 'stage-basic.json')));
    for (const texture of atlas.textures) assert.ok(fs.existsSync(path.join(dir, texture.image)), texture.image);
    const frames = new Set(atlas.textures.flatMap(t => t.frames.map(f => f.filename)));
    const scenes = ['Stage.js', 'Switchbox.js'].map(file => fs.readFileSync(path.join(__dirname, '../src/scenes/rooms/stage', file), 'utf8'));
    for (const scene of scenes) {
        for (const [, frame] of scene.matchAll(/'stage-basic', '([^'$]+)'/g)) assert.ok(frames.has(frame), frame);
    }
    for (const name of ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']) assert.ok(frames.has(`switchbox/switch${name}0001`), name);
    const anims = JSON.parse(fs.readFileSync(path.join(dir, 'basic-anims.json'))).anims.map(a => a.key);
    for (const key of ['costumeone', 'costumetwo']) assert.ok(anims.includes(key), key);
    const physics = JSON.parse(fs.readFileSync(path.join(dir, 'stage-physics.json')));
    for (const key of ['block', 'plaza']) assert.ok(physics[key], key);
});

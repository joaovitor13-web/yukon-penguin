const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { makeConfig } = require('../deploy/runtime/config.cjs');
const { assemble } = require('../scripts/assemble-local.cjs');
const { crumbNames, checkAssets } = require('../scripts/check-assets.cjs');

test('configuração gera a origem LAN e preserva a configuração original', () => {
    const template = JSON.parse(fs.readFileSync(path.join(__dirname, '../server/config/config_example.json'), 'utf8'));
    const config = makeConfig({ DB_PASSWORD: 'test', CRYPTO_SECRET: 'test', PUBLIC_ORIGIN: 'http://192.168.1.50:8080' }, template);
    assert.equal(config.cors.origin, 'http://192.168.1.50:8080');
    assert.equal(config.database.host, 'db');
    assert.equal(config.rateLimit.ipAddressHeader, 'x-real-ip');
    assert.equal(template.database.password, 'password');
    assert.throws(() => makeConfig({}, template), /obrigatória/);
    assert.throws(() => makeConfig({ DB_PASSWORD: 'x', CRYPTO_SECRET: 'x', PUBLIC_ORIGIN: 'http://host/path' }, template), /PUBLIC_ORIGIN/);
});

test('montagem local configura mundos, remove CDN e mantém a mídia original', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'yukon-local-'));
    const write = (p, content) => {
        const file = path.join(root, p);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
    };
    try {
        assert.equal(checkAssets(root).length, crumbNames.length + 1);
        assert.throws(() => assemble(root), /Assets incompletos/);
        write('assets/media/preload/preload-pack.json', '{}');
        for (const name of crumbNames) write(`assets/media/crumbs/en/${name}.json`, '{}');
        const original = JSON.stringify({ Login: { host: 'https://remote', path: '/remote', name: 'Login' }, Extra: {} });
        write('assets/media/crumbs/en/worlds.json', original);
        write('dist/index.html', '<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script><script src="https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle/ruffle.min.js"></script>');
        write('node_modules/phaser/dist/phaser.min.js', '// fixture');
        write('node_modules/phaser/LICENSE.md', 'MIT fixture');
        write('node_modules/@ruffle-rs/ruffle/ruffle.js', '// fixture');
        write('node_modules/@ruffle-rs/ruffle/core.wasm', 'fixture');
        write('deploy/account-info.html', '<p>Conta local</p>');
        fs.cpSync(path.join(__dirname, '../resources/pizzatron'), path.join(root, 'resources/pizzatron'), { recursive: true });
        fs.cpSync(path.join(__dirname, '../resources/create'), path.join(root, 'resources/create'), { recursive: true });
        fs.cpSync(path.join(__dirname, '../resources/pizza'), path.join(root, 'resources/pizza'), { recursive: true });
        fs.cpSync(path.join(__dirname, '../resources/pt-BR'), path.join(root, 'resources/pt-BR'), { recursive: true });
        assemble(root);
        const crumbs = JSON.parse(fs.readFileSync(path.join(root, 'local-dist/assets/media/crumbs/en/crumbs.json'), 'utf8'));
        assert.equal(crumbs.worlds.Login.host, '');
        assert.equal(crumbs.worlds.Blizzard.path, '/world/blizzard/');
        assert.equal(crumbs.worlds.Extra, undefined);
        assert.equal(crumbs.rooms['330'].path, 'pizza/Pizza');
        assert.equal(crumbs.games['910'].path, 'pizzatron/game.swf');
        assert.ok(fs.existsSync(path.join(root, 'local-dist/assets/media/flash/games/pizzatron/lang/en/locale.swf')));
        assert.ok(fs.existsSync(path.join(root, 'local-dist/assets/media/rooms/pizza/pizza.png')));
        for (const image of ['doll-body.png', 'doll-outline.png', 'starburst.png']) {
            assert.ok(fs.existsSync(path.join(root, 'local-dist/create/img', image)), image);
        }
        assert.equal(fs.readFileSync(path.join(root, 'assets/media/crumbs/en/worlds.json'), 'utf8'), original);
        assert.ok(!fs.readFileSync(path.join(root, 'local-dist/index.html'), 'utf8').includes('cdn.jsdelivr.net'));
        assert.ok(fs.existsSync(path.join(root, 'local-dist/assets/vendor/ruffle/core.wasm')));
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

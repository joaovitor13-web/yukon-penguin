const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { crumbNames } = require('../scripts/check-assets.cjs');
const { translateCrumbs, readTranslations } = require('../scripts/translate-content.cjs');

const root = path.join(__dirname, '..');
const source = ['assets/media/crumbs/en', 'resources/yukon-assets/media/crumbs/en']
    .map(dir => path.join(root, dir)).find(dir => fs.existsSync(path.join(dir, 'strings.json')));
const loadCrumbs = () => Object.fromEntries(crumbNames.map(name =>
    [name, JSON.parse(fs.readFileSync(path.join(source, `${name}.json`), 'utf8'))]));
const ids = list => list.flatMap(entry => [entry.id, ...(entry.menu ? ids(entry.menu) : [])]);

test('tradução pt-BR cobre todos os textos dos crumbs originais', { skip: !source && 'crumbs originais ausentes' }, () => {
    const en = loadCrumbs();
    const pt = readTranslations(root);
    const placeholders = text => (text.match(/%\d/g) || []).sort().join();

    assert.deepEqual(Object.keys(pt.strings).sort(), Object.keys(en.strings).sort());
    for (const [key, text] of Object.entries(en.strings)) assert.equal(placeholders(pt.strings[key]), placeholders(text), key);

    for (const name of ['items', 'furniture', 'igloos', 'flooring']) {
        const missing = Object.values(en[name]).filter(entry => entry.name && !(entry.name in pt.names));
        assert.deepEqual(missing.map(entry => entry.name), [], name);
    }
    assert.deepEqual(Object.keys(pt.pets).sort(), Object.keys(en.pets).sort());
    assert.deepEqual(Object.keys(pt.safe_messages).map(Number).sort(), ids(en.safe_messages).sort());
    assert.deepEqual(pt.postcards.map(c => c.postcards.map(p => p.id)), en.postcards.map(c => c.postcards.map(p => p.id)));
    assert.deepEqual(pt.phone_locations.map(l => l.id), en.phone_locations.map(l => l.id));
    assert.deepEqual(pt.missions.map(m => [m.id, m.award]), en.missions.map(m => [m.id, m.award]));
    assert.equal(pt.jokes.length, en.jokes.length);
    assert.deepEqual(Object.keys(pt.tour_messages).sort(), Object.keys(en.tour_messages).sort());
    for (const name of ['tour_quiz', 'agent_quiz']) {
        assert.deepEqual(pt[name].map(q => Object.values(q.answers)), en[name].map(q => Object.values(q.answers)), name);
    }
});

test('crumbs traduzidos preservam ids e chaves usadas pelo jogo', { skip: !source && 'crumbs originais ausentes' }, () => {
    const crumbs = loadCrumbs();
    const original = loadCrumbs();
    translateCrumbs(root, crumbs);

    assert.equal(crumbs.strings.load_town, 'Carregando o Centro');
    assert.equal(crumbs.items[1].name, 'Azul');
    assert.equal(crumbs.items[1].cost, original.items[1].cost);
    assert.equal(crumbs.pets[0].name, 'Azul');
    assert.equal(crumbs.pets[0].key, 'blue');
    assert.deepEqual(ids(crumbs.safe_messages), ids(original.safe_messages));
    assert.deepEqual(Object.keys(crumbs.items), Object.keys(original.items));
    for (const name of ['tour_quiz', 'agent_quiz']) assert.notDeepEqual(crumbs[name], original[name]);
});

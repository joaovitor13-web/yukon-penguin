const fs = require('node:fs');
const path = require('node:path');

// Traduções pt-BR aplicadas aos crumbs da distribuição; a mídia original não é alterada.
// Cada entrada é casada por id, chave ou posição. O que não tiver tradução fica como está.
const translationDir = root => path.join(root, 'resources/pt-BR');
const isList = value => Array.isArray(value);

function readTranslations(root) {
    const dir = translationDir(root);
    return Object.fromEntries(fs.readdirSync(dir).filter(file => file.endsWith('.json'))
        .map(file => [path.basename(file, '.json'), JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))]));
}

function byId(list) {
    return new Map(list.map(entry => [entry.id, entry]));
}

// Perguntas só são trocadas quando as respostas certas ficam nas mesmas posições.
function sameAnswers(original, translated) {
    return JSON.stringify(Object.values(original.answers)) === JSON.stringify(Object.values(translated.answers));
}

function translateCrumbs(root, crumbs) {
    const pt = readTranslations(root);

    Object.assign(crumbs.strings, pt.strings);

    for (const name of ['items', 'furniture', 'igloos', 'flooring']) {
        for (const entry of Object.values(crumbs[name])) {
            if (entry.name in pt.names) entry.name = pt.names[entry.name];
        }
    }

    // O nome em inglês continua identificando os ícones e sprites do puffle.
    for (const [id, pet] of Object.entries(crumbs.pets)) {
        pet.key = pet.key || pet.name.toLowerCase();
        if (id in pt.pets) pet.name = pt.pets[id];
    }

    if (isList(crumbs.safe_messages)) {
        const walk = list => list.forEach(message => {
            if (message.id in pt.safe_messages) message.name = pt.safe_messages[message.id];
            if (message.menu) walk(message.menu);
        });
        walk(crumbs.safe_messages);
    }

    if (isList(crumbs.postcards)) {
        const cards = byId(pt.postcards.flatMap(category => category.postcards));
        crumbs.postcards.forEach((category, index) => {
            if (pt.postcards[index]) category.name = pt.postcards[index].name;
            for (const card of category.postcards) {
                if (cards.has(card.id)) card.subject = cards.get(card.id).subject;
            }
        });
    }

    for (const [name, fields] of [['phone_locations', ['name']], ['missions', ['title', 'description']]]) {
        if (!isList(crumbs[name])) continue;
        const translated = byId(pt[name]);
        for (const entry of crumbs[name]) {
            for (const field of fields) {
                if (translated.has(entry.id)) entry[field] = translated.get(entry.id)[field];
            }
        }
    }

    if (isList(crumbs.jokes)) {
        crumbs.jokes = crumbs.jokes.map((joke, index) => pt.jokes[index] ?? joke);
    }

    for (const [room, message] of Object.entries(pt.tour_messages)) {
        if (room in crumbs.tour_messages) crumbs.tour_messages[room] = message;
    }

    for (const name of ['tour_quiz', 'agent_quiz']) {
        if (!isList(crumbs[name])) continue;
        crumbs[name] = crumbs[name].map((question, index) => {
            const translated = pt[name][index];
            return translated && sameAnswers(question, translated) ? translated : question;
        });
    }
}

module.exports = { translateCrumbs, readTranslations };

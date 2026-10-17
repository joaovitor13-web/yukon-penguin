const fs = require('node:fs');
const path = require('node:path');

const crumbNames = [
    'agent_quiz', 'colors', 'flooring', 'furniture', 'games', 'igloos', 'items',
    'jokes', 'missions', 'penguin', 'pets', 'phone_locations', 'postcards',
    'quick_keys', 'rooms', 'safe_messages', 'secret_frames', 'sounds', 'strings',
    'tour_messages', 'tour_quiz', 'widgets', 'worlds'
];

function checkAssets(root) {
    const required = ['assets/media/preload/preload-pack.json',
        ...crumbNames.map(name => `assets/media/crumbs/en/${name}.json`)];
    const errors = [];
    for (const relative of required) {
        try {
            const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
            if (!value || typeof value !== 'object') errors.push(`JSON inválido: ${relative}`);
        } catch (error) {
            errors.push(`${relative}: ${error.code === 'ENOENT' ? 'ausente' : 'não foi possível ler o JSON'}`);
        }
    }
    return errors;
}

module.exports = { checkAssets, crumbNames };
if (require.main === module) {
    const root = path.resolve(__dirname, '..');
    const errors = checkAssets(root);
    if (errors.length) {
        console.error('Assets incompletos. Consulte docs/ASSETS.md.\n' + errors.join('\n'));
        process.exit(1);
    }
    console.log('Arquivos JSON essenciais presentes. Isso ainda não valida todas as imagens, sons e minijogos.');
}

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { checkAssets } = require('./check-assets.cjs');

const root = path.resolve(__dirname, '..');
const source = process.argv[2] && fs.realpathSync(process.argv[2]);
if (!source || !fs.existsSync(path.join(source, 'media'))) {
    console.error('Uso: node scripts/import-assets.cjs /caminho/da/pasta/assets (deve conter media/)');
    process.exit(1);
}
const target = path.join(root, 'assets');
if (source === target || source.startsWith(target + path.sep) || target.startsWith(source + path.sep)) {
    throw new Error('A origem precisa ficar fora da pasta assets do projeto.');
}
// Uma pasta extraída, sem execução de scripts nem interpretação de arquivos compactados.
const manifest = [];
function inspect(dir, prefix = '') {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const relative = path.join(prefix, item.name);
        const file = path.join(dir, item.name);
        if (item.isSymbolicLink()) throw new Error(`Link simbólico não permitido: ${relative}`);
        if (item.isDirectory()) inspect(file, relative);
        else if (item.isFile()) manifest.push({ path: relative, bytes: fs.statSync(file).size,
            sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
        else throw new Error(`Tipo de arquivo não suportado: ${relative}`);
    }
}
for (const name of ['media', 'fonts']) {
    const dir = path.join(source, name);
    if (fs.existsSync(dir)) {
        if (fs.lstatSync(dir).isSymbolicLink()) throw new Error('A pasta não pode ser um link simbólico.');
        inspect(dir, name);
    }
}
if (fs.existsSync(path.join(target, 'media'))) {
    throw new Error('assets/media já existe. Faça uma cópia e remova a versão anterior antes de importar outra.');
}
for (const name of ['media', 'fonts']) {
    if (fs.existsSync(path.join(source, name))) fs.cpSync(path.join(source, name), path.join(target, name), { recursive: true });
}
fs.writeFileSync(path.join(root, 'assets-manifest.local.json'), JSON.stringify({
    importedAt: new Date().toISOString(), files: manifest
}, null, 2));
const errors = checkAssets(root);
if (errors.length) {
    console.error('Pacote importado, mas incompleto.\n' + errors.join('\n'));
    process.exit(1);
}
console.log(`${manifest.length} arquivos importados. Registre a origem em suas anotações locais. A compatibilidade visual ainda precisa ser testada.`);

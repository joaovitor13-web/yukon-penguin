const fs = require('node:fs');
const path = require('node:path');
const { checkAssets, crumbNames } = require('./check-assets.cjs');
function assemble(root) {
const errors = checkAssets(root);
if (errors.length) throw new Error('Assets incompletos; execute npm run local:check-assets.');
const out = path.join(root, 'local-dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
fs.cpSync(path.join(root, 'dist'), out, { recursive: true });

// Não alterar a mídia original importada; gerar a configuração na distribuição.
const crumbsPath = path.join(out, 'assets/media/crumbs/en');
const worlds = JSON.parse(fs.readFileSync(path.join(crumbsPath, 'worlds.json'), 'utf8'));
for (const [key, socketPath] of Object.entries({ Login: '/world/login/', Blizzard: '/world/blizzard/' })) {
    worlds[key] = { ...worlds[key], host: '', path: socketPath };
}
for (const key of Object.keys(worlds)) if (!['Login', 'Blizzard'].includes(key)) delete worlds[key];
fs.writeFileSync(path.join(crumbsPath, 'worlds.json'), JSON.stringify(worlds));
const crumbs = Object.fromEntries(crumbNames.map(name => [name,
    JSON.parse(fs.readFileSync(path.join(crumbsPath, `${name}.json`), 'utf8'))]));
fs.writeFileSync(path.join(crumbsPath, 'crumbs.json'), JSON.stringify(crumbs));

const vendor = path.join(out, 'assets/vendor');
fs.mkdirSync(vendor, { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules/phaser/dist/phaser.min.js'), path.join(vendor, 'phaser.min.js'));
fs.copyFileSync(path.join(root, 'node_modules/phaser/LICENSE.md'), path.join(vendor, 'PHASER_LICENSE.md'));
fs.cpSync(path.join(root, 'node_modules/@ruffle-rs/ruffle'), path.join(vendor, 'ruffle'), { recursive: true });
const htmlPath = path.join(out, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8')
    .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/phaser@3\.80\.1\/dist\/phaser\.min\.js/g, 'assets/vendor/phaser.min.js')
    .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/@ruffle-rs\/ruffle\/ruffle\.min\.js/g, 'assets/vendor/ruffle/ruffle.js');
if (html.includes('cdn.jsdelivr.net')) throw new Error('Uma dependência CDN ficou no HTML.');
fs.writeFileSync(htmlPath, html);
fs.copyFileSync(path.join(root, 'deploy/account-info.html'), path.join(out, 'account-info.html'));
console.log('Distribuição local gerada em local-dist/. Validar mídia e jogos em navegador.');
}

module.exports = { assemble };
if (require.main === module) assemble(path.resolve(__dirname, '..'));

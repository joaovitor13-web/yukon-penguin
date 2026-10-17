const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { makeConfig } = require('./config.cjs');
const mysql = require('mysql2/promise');

(async () => {
    const world = process.argv[2];
    if (!['Login', 'Blizzard'].includes(world)) throw new Error('Mundo inválido.');
    const template = JSON.parse(fs.readFileSync('config/config_example.json', 'utf8'));
    const config = makeConfig(process.env, template);
    fs.writeFileSync('config/config.json', JSON.stringify(config), { mode: 0o600 });
    let ready = false;
    for (let attempt = 0; attempt < 30; attempt++) {
        let db;
        try {
            db = await mysql.createConnection({
                host: config.database.host, user: config.database.user,
                password: config.database.password, database: config.database.database,
                connectTimeout: 2000
            });
            const [rows] = await db.execute("SELECT id FROM worlds WHERE id = 'Blizzard'");
            if (!rows.length) throw new Error('O mundo Blizzard não está no banco.');
            ready = true;
            break;
        } catch (error) {
            if (attempt === 29) throw new Error('Banco ou esquema indisponível após 30 tentativas.');
            await new Promise(resolve => setTimeout(resolve, 2000));
        } finally {
            if (db) await db.end();
        }
    }
    if (!ready) throw new Error('Banco indisponível.');
    const child = spawn(process.execPath, ['dist/World.js', world], { stdio: 'inherit' });
    for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill(signal));
    child.on('error', () => process.exit(1));
    child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
})().catch(error => { console.error(error.message); process.exit(1); });

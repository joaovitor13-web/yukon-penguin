const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

function readSecret(label) {
    if (!process.stdin.isTTY) throw new Error('Use um terminal interativo para digitar a senha.');
    return new Promise((resolve, reject) => {
        let value = '';
        process.stdout.write(label);
        process.stdin.setRawMode(true);
        process.stdin.setEncoding('utf8');
        process.stdin.resume();
        const finish = () => {
            process.stdin.setRawMode(false);
            process.stdin.removeListener('data', onData);
            process.stdin.pause();
            process.stdout.write('\n');
        };
        const onData = chunk => {
            for (const char of chunk) {
                if (char === '\u0003') { finish(); reject(new Error('Cancelado.')); return; }
                if (char === '\r' || char === '\n') { finish(); resolve(value); return; }
                if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
                else if (char >= ' ') value += char;
            }
        };
        process.stdin.on('data', onData);
    });
}

(async () => {
    const [action, username] = process.argv.slice(2);
    if (!['create', 'reset-password'].includes(action) || !/^[A-Za-z0-9 ]{4,12}$/.test(username || '') || username.trim() !== username) {
        throw new Error('Uso: accounts.cjs create|reset-password NOME (4–12 letras, números ou espaços).');
    }
    const password = await readSecret('Senha (não será exibida): ');
    if (password.length < 8 || Buffer.byteLength(password) > 72 || password.trim() !== password) {
        throw new Error('Use pelo menos 8 caracteres, até 72 bytes e sem espaços nas extremidades.');
    }
    if (password !== await readSecret('Repita a senha: ')) throw new Error('As senhas não coincidem.');
    const hash = await bcrypt.hash(password, 10);
    const db = await mysql.createConnection({
        host: process.env.DB_HOST, database: process.env.DB_NAME,
        user: process.env.DB_USER, password: process.env.DB_PASSWORD
    });
    try {
        await db.beginTransaction();
        if (action === 'create') {
            await db.execute('INSERT INTO users (username, password, rank) VALUES (?, ?, 1)', [username, hash]);
            // O gatilho SQL cria iglu, inventário inicial e cartão.
        } else {
            const [users] = await db.execute('SELECT id FROM users WHERE username = ? FOR UPDATE', [username]);
            if (!users.length) throw new Error('Conta não encontrada.');
            await db.execute('UPDATE users SET password = ?, loginKey = NULL WHERE id = ?', [hash, users[0].id]);
            await db.execute('DELETE FROM auth_tokens WHERE userId = ?', [users[0].id]);
        }
        await db.commit();
        console.log(action === 'create' ? 'Conta criada.' : 'Senha alterada e tokens salvos revogados. Reinicie o mundo para encerrar sessões abertas.');
    } catch (error) {
        await db.rollback();
        throw error;
    } finally { await db.end(); }
})().catch(error => {
    console.error(error.code === 'ER_DUP_ENTRY' ? 'Esse nome já está em uso.' : error.code ? `Falha no banco: ${error.code}` : error.message);
    process.exit(1);
});

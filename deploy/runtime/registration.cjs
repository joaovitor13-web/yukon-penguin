const http = require('node:http');

// Cores oferecidas no cadastro original (itens 1 a 13 do catálogo).
const colors = Array.from({ length: 13 }, (_, i) => i + 1);

function validateAccount(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Preencha os dados da conta.';
    const { username, password, confirmation, color } = value;
    if (typeof username !== 'string' || !/^[A-Za-z0-9 ]{4,12}$/.test(username) || username.trim() !== username) {
        return 'Use um nome com 4 a 12 letras sem acento, números ou espaços internos.';
    }
    if (typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72 || password.trim() !== password) {
        return 'Use uma senha com pelo menos 8 caracteres, até 72 bytes e sem espaços nas extremidades.';
    }
    if (password !== confirmation) return 'As senhas não coincidem.';
    if (!colors.includes(color)) return 'Escolha uma cor para o seu pinguim.';
    return null;
}

function createRegistrationServer({ origin, createAccount }) {
    let pending = 0;
    return http.createServer(async (req, res) => {
        const reply = (status, message) => {
            res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
            res.end(JSON.stringify({ message }));
        };
        if (req.url !== '/api/accounts') return reply(404, 'Página não encontrada.');
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return reply(405, 'Use o formulário para criar sua conta.');
        }
        if (req.headers.origin !== origin) return reply(403, 'Abra o cadastro pelo endereço do jogo.');
        if ((req.headers['content-type'] || '').split(';')[0].trim() !== 'application/json') {
            return reply(415, 'Envie os dados pelo formulário de cadastro.');
        }
        if (pending >= 2) return reply(429, 'Há outros cadastros em andamento. Aguarde e tente novamente.');
        pending++;
        try {
            const chunks = [];
            let size = 0;
            for await (const chunk of req) {
                size += chunk.length;
                if (size > 4096) return reply(413, 'Os dados enviados são muito grandes.');
                chunks.push(chunk);
            }
            let account;
            try { account = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
            catch { return reply(400, 'Não foi possível ler os dados. Envie o formulário novamente.'); }
            const error = validateAccount(account);
            if (error) return reply(400, error);
            await createAccount(account.username, account.password, account.color);
            reply(201, 'Conta criada! Volte ao jogo e entre com seu nome e senha.');
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') return reply(409, 'Esse nome já está em uso. Escolha outro.');
            console.error('Falha no cadastro:', error.code || 'erro interno');
            reply(503, 'Não foi possível criar a conta agora. Tente novamente em instantes.');
        } finally { pending--; }
    });
}

module.exports = { colors, validateAccount, createRegistrationServer };

if (require.main === module) {
    const mysql = require('mysql2/promise');
    const bcrypt = require('bcrypt');
    const { PUBLIC_ORIGIN: origin, DB_HOST: host, DB_NAME: database, DB_USER: user, DB_PASSWORD: password } = process.env;
    if (!origin || !password) throw new Error('Configure PUBLIC_ORIGIN e DB_PASSWORD.');
    const pool = mysql.createPool({ host, database, user, password, connectionLimit: 2 });
    const server = createRegistrationServer({
        origin,
        async createAccount(username, plaintext, color) {
            const hash = await bcrypt.hash(plaintext, 10);
            // O gatilho do banco cria iglu, inventário com a cor e cartão de boas-vindas.
            await pool.execute('INSERT INTO users (username, password, rank, color) VALUES (?, ?, 1, ?)', [username, hash, color]);
        }
    });
    server.requestTimeout = 10000;
    server.listen(6113, '0.0.0.0');
    for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => {
        server.close(() => pool.end().then(() => process.exit(0)));
    });
}

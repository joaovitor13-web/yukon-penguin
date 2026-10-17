const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { validateAccount, createRegistrationServer } = require('../deploy/runtime/registration.cjs');

const account = { username: 'Pinguim1', password: 'umaSenha123', confirmation: 'umaSenha123' };

test('cadastro valida nomes, confirmação e limite em bytes do bcrypt', () => {
    assert.equal(validateAccount(account), null);
    for (const value of [null, [], {}, { ...account, username: 'João' }, { ...account, username: ' Nome' },
        { ...account, username: 'abc' }, { ...account, password: 'curta' },
        { ...account, password: ' senha123' }, { ...account, confirmation: 'diferente' },
        { ...account, password: 'é'.repeat(37), confirmation: 'é'.repeat(37) }]) {
        assert.equal(typeof validateAccount(value), 'string');
    }
    assert.equal(validateAccount({ ...account, password: 'é'.repeat(36), confirmation: 'é'.repeat(36) }), null);
});

test('HTTP cria conta comum, rejeita duplicata, origem externa e dados inválidos', async t => {
    const created = [];
    const origin = 'http://192.168.1.19:8080';
    const server = createRegistrationServer({ origin, async createAccount(username, password) {
        if (created.length) throw Object.assign(new Error(), { code: 'ER_DUP_ENTRY' });
        created.push({ username, password });
    } });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    t.after(() => { server.closeAllConnections(); server.close(); });
    const url = `http://127.0.0.1:${server.address().port}/api/accounts`;
    const post = (body, headers = {}) => fetch(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
    assert.equal((await post(account, { Origin: 'http://external.test' })).status, 403);
    assert.equal((await post(account, { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal((await post({ ...account, confirmation: '' })).status, 400);
    assert.equal((await post({ padding: 'x'.repeat(5000) })).status, 413);
    assert.equal((await fetch(url, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{' })).status, 400);
    assert.equal(created.length, 0);
    const response = await post({ ...account, rank: 5 });
    assert.equal(response.status, 201);
    assert.match((await response.json()).message, /Conta criada/);
    assert.deepEqual(created, [{ username: account.username, password: account.password }]);
    assert.equal((await post(account)).status, 409);
    assert.equal((await fetch(url)).status, 405);
});

test('HTTP limita cadastros simultâneos e volta a aceitar depois', async t => {
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    let count = 0;
    let notifyStarted;
    const started = new Promise(resolve => { notifyStarted = resolve; });
    const server = createRegistrationServer({ origin: 'http://game', async createAccount() {
        count++;
        if (count === 2) notifyStarted();
        await gate;
    } });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    t.after(() => { release(); server.closeAllConnections(); server.close(); });
    const post = () => fetch(`http://127.0.0.1:${server.address().port}/api/accounts`, {
        method: 'POST', headers: { Origin: 'http://game', 'Content-Type': 'application/json' }, body: JSON.stringify(account)
    });
    const first = post();
    const second = post();
    await started;
    assert.equal((await post()).status, 429);
    release();
    assert.equal((await first).status, 201);
    assert.equal((await second).status, 201);
    assert.equal((await post()).status, 201);
});

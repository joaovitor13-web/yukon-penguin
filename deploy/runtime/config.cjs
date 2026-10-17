const fs = require('node:fs');

function makeConfig(env, template) {
    for (const key of ['DB_PASSWORD', 'CRYPTO_SECRET', 'PUBLIC_ORIGIN']) {
        if (!env[key]) throw new Error(`Variável obrigatória: ${key}`);
    }
    const origin = new URL(env.PUBLIC_ORIGIN);
    if (origin.origin !== env.PUBLIC_ORIGIN || !['http:', 'https:'].includes(origin.protocol)) {
        throw new Error('PUBLIC_ORIGIN deve conter somente protocolo, host e porta.');
    }
    const config = structuredClone(template);
    config.database = {
        ...config.database, host: env.DB_HOST || 'db', database: env.DB_NAME || 'yukon',
        user: env.DB_USER || 'yukon', password: env.DB_PASSWORD,
        debug: false, logQueryParameters: false
    };
    config.crypto.secret = env.CRYPTO_SECRET;
    config.socketio.https = false;
    config.cors.origin = origin.origin;
    config.rateLimit.ipAddressHeader = 'x-real-ip';
    config.worlds = {
        Login: { host: 'login', port: 6111 },
        Blizzard: { host: 'world', port: 6112, maxUsers: 30 }
    };
    return config;
}

module.exports = { makeConfig };
if (require.main === module) {
    const template = JSON.parse(fs.readFileSync('config/config_example.json', 'utf8'));
    fs.writeFileSync('config/config.json', JSON.stringify(makeConfig(process.env, template), null, 2), { mode: 0o600 });
}

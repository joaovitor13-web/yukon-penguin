const fs = require('node:fs');
const { randomBytes } = require('node:crypto');
const { isIP } = require('node:net');
const path = require('node:path');
process.chdir(path.join(__dirname, '..'));
const ip = process.argv[2];
if (isIP(ip) !== 4) {
    console.error('Uso: node scripts/setup-local.cjs IP_V4_DO_SERVIDOR');
    process.exit(1);
}
if (fs.existsSync('.env')) {
    console.error('.env já existe. Edite LAN_IP/WEB_PORT nele; os segredos foram preservados.');
    process.exit(1);
}
const secret = () => randomBytes(32).toString('hex');
fs.writeFileSync('.env', `LAN_IP=${ip}\nWEB_PORT=8080\nDB_PASSWORD=${secret()}\nDB_ROOT_PASSWORD=${secret()}\nCRYPTO_SECRET=${secret()}\n`, { mode: 0o600, flag: 'wx' });
console.log(`Configuração criada. URL: http://${ip}:8080`);

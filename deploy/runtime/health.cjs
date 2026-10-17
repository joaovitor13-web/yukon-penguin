const socket = require('node:net').connect(Number(process.argv[2]), '127.0.0.1');
socket.setTimeout(2000);
socket.once('connect', () => { socket.end(); process.exit(0); });
socket.once('error', () => process.exit(1));
socket.once('timeout', () => process.exit(1));

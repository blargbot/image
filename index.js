const Logger = require('./src/Core/Logger');
global._config = require('./config.json');

process.on('unhandledRejection', (err, p) => {
    console.error('Unhandled Promise Rejection:', err.stack);
});

new Logger('MS', _config.log.level || 'info').setGlobal();
console.init('Initializing...');

const { Website } = require('./src/Frontend');

const Database = require('./src/Core/Database');
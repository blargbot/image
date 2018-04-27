const Logger = require('./src/Core/Logger');
global._config = require('./config.json');

process.on('unhandledRejection', (err, p) => {
    console.error('Unhandled Promise Rejection:', err.stack);
});

new Logger('MS', _config.log.level || 'info').setGlobal();
console.log('fuck me');

const { Website } = require('./src/Frontend');
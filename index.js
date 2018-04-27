const Logger = require('./src/Core/Logger');
global._config = require('./config.json');

new Logger('MS', _config.log.level || 'info').setGlobal();
console.log('fuck me');
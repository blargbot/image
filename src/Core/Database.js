const Sequelize = require('sequelize');
const sequelize = global._db = new Sequelize(_config.db.name, _config.db.user, _config.db.pass, {
    host: _config.db.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

const Models = {
    User: sequelize.define('user', {
        userid: { type: Sequelize.BIGINT, primaryKey: true },
        tokenDate: Sequelize.DATE,
        uses: { type: Sequelize.JSON, defaultValue: {} }
    })
}
global._dbModels = Models;

console.init('Connecting to DB...');
sequelize.authenticate()
    .then(() => {
        console.init('Database authenticated. Syncing...');
        sequelize.sync({ force: false });
    }).catch(err => {
        console.init('Failed to connect to DB.');
    });

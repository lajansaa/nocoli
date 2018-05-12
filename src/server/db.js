const pg = require('pg');
const user = require('./models/user');

const configs = {
  user: 'Isa',
  host: '127.0.0.1',
  database: 'nocoli',
  port: 5432
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

module.exports = {
  userDB: user(pool)
}



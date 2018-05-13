const pg = require('pg');
const user = require('./models/user');

const configs = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'nocoli',
  port: process.env.DB_PORT
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

module.exports = {
  userDB: user(pool)
}



const pgp = require('pg-promise')();
const dbUser = process.env.POSTGRES_USER;
const dbPw = process.env.POSTGRES_PASSWORD;
const dbPath = process.env.POSTGRES_DB;
const db = pgp(`postgres://${dbUser}:${dbPw}@db:5432/${dbPath}`);

// TESTING SERVER IS ONLINE
db.one('Select $1 AS value', 123)
  .then(data => console.log('DATA: ', data.value))
  .catch(err => console.log('ERROR: ', error));

module.exports = db;
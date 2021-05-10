const pgp = require('pg-promise')();
const db = pgp('postgres:///products');
// const fs = require('fs');
// const csv = require('csv-parser');

// TESTING SERVER IS ONLINE
db.one('Select $1 AS value', 123)
  .then(data => console.log('DATA: ', data.value))
  .catch(err => console.log('ERROR: ', error));

module.exports = db;
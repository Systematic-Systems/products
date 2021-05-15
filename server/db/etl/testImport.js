const pgp = require('pg-promise')();
const db = require('../index.js');
const fs = require('fs');

// TEST IMPORT
const cs = new pgp.helpers.ColumnSet(['id', 'styleid', 'thumbnail_url', 'url'], {table: 'photos'});

const readable = fs.createReadStream('../../../data/test.csv');
readable
.setEncoding('utf-8')
.on('data', function (data) {
  readable.pause();

  let lines = data.split('\n');

  (async () => {
    var dataArray = [];
    for await (line of lines) {
      if (line.substr(-1) !== '"') {
        line += '"';
      }

      let lineArr = line.split(',');
      if (lineArr[0].includes('id')) {
        continue;
      } else {
        lineArr[0] = Number(lineArr[0]);
        lineArr[1] = Number(lineArr[1]);
      }

      const values = {'id': lineArr[0], 'styleid': lineArr[1], 'url': lineArr[2], 'thumbnail_url': lineArr[3]};
      dataArray.push(values);
    }
    const query = pgp.helpers.insert(dataArray, cs);
    db.none(query)
    .then(() => {
      readable.resume();
      console.log('insertion successful');
    })
    .catch(err => {
      console.log('this is the dataArray ', dataArray[dataArray.length - 1]);
      console.log('unable to insert', err);
    })
  })()

})
.on('end', function() {
  console.log('done');
});
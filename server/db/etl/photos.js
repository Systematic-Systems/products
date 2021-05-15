const pgp = require('pg-promise')();
const db = require('../index.js');
const fs = require('fs');

// PHOTOS IMPORT
const cs = new pgp.helpers.ColumnSet(['id', 'styleid', 'thumbnail_url', 'url'], {table: 'photos'});

let isPartialLine = false;
let lastLine = '';

const readable = fs.createReadStream('../../../data/photos.csv');
readable
.setEncoding('utf-8')
.on('data', function (data) {
  readable.pause();

  if (isPartialLine) {
    data = lastLine + data;
    isPartialLine = false;
  }

  let lines = data.split('\n');

  lastLine = lines.pop();

  if (lastLine.slice(-4) !== 'q=80"') {
    isPartialLine = true;
  }

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
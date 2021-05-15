const pgp = require('pg-promise')();
const db = require('../index.js');
const fs = require('fs');
const csv = require('csv-parser');

// STYLES IMPORT
const cs = new pgp.helpers.ColumnSet(['id', 'productid', 'name', 'sale_price', 'original_price', 'default_style'], {table: 'styles'});
fs.createReadStream('../../../data/styles.csv')
.pipe(csv())
.on('data', function(data) {
  try {
    if (data.default_style === undefined) {
        // missing data in columns!
        var copiedData = JSON.parse(JSON.stringify(data));
        data.name = 'Multi-Color';
        data.sale_price = copiedData.name;
        data.original_price = copiedData.sale_price;
        data.default_style = copiedData.original_price
    }

      if (data.sale_price === 'null') {
          data.sale_price = 0;
      }

      if (data.original_price === 'null') {
          data.original_price = 0;
      }
      if (data.default_style === 'null') {
          data.default_style = 0;
      }

      if (typeof data.sale_price === 'string' && data.sale_price.includes('$')) {
          data.sale_price = data.sale_price.replace('$', '');
      }

      if (typeof data.original_price === 'string' && data.original_price.includes('$')) {
          data.original_price = data.original_price.replace('$', '');
      }

      data.id = Number(data.id);
      data.productId = Number(data.productId);
      data.sale_price = Number(data.sale_price);
      data.original_price = Number(data.original_price);
      data.default_style = Number(data.default_style);

      if (data.id && data.productId && data.name && (data.sale_price === 0 || data.sale_price) && (data.original_price === 0 || data.original_price) && (data.default_style === 0 || data.default_style)) {

        const values = [{'id': data.id, 'productid': data.productId, 'name': data.name, 'sale_price': data.sale_price, 'original_price': data.original_price, 'default_style': data.default_style}];
        const query = pgp.helpers.insert(values, cs);

        db.none(query)
        .then(success => console.log('hi'))
        .catch(error => {

            var stringToWrite = `${data.id}, ${data.productId}, ${data.name}, ${data.sale_price}, ${data.original_price}, ${data.default_style}  \n`;
            fs.writeFile('problemStyles.csv', stringToWrite, { flag: 'a'}, err => { if (err) console.log(err) });
        })
      } else {
        var stringToWrite = `${data.id}, ${data.productId}, ${data.name}, ${data.sale_price}, ${data.original_price}, ${data.default_style} \n`;
        fs.writeFile('problemStyles.csv', stringToWrite, { flag: 'a'}, err => { if (err) console.log(err) });
      }
  }
  catch(err) {
      console.log(`${data.productId} failed`);
      var stringToWrite = `${data.id}, ${data.productId}, ${data.name}, ${data.sale_price}, ${data.original_price}, ${data.default_style} \n`;
      fs.writeFile('problemStyles.csv', stringToWrite, { flag: 'a'}, err => { if (err) console.log(err) });
  }
})
.on('end',function(){
    console.log('done');
});
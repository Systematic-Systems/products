const pgp = require('pg-promise')();
const db = require('../index.js');
const fs = require('fs');
const csv = require('csv-parser');

// PRODUCT IMPORT
const cs = new pgp.helpers.ColumnSet(['id', 'name', 'slogan', 'description', 'category', 'default_price'], {table: 'product'});
fs.createReadStream('../../../data/product.csv')
.pipe(csv())
.on('data', function(data){
    try {

        if (data.default_price === undefined) {
            // we have missing columns!
            var copiedData = JSON.parse(JSON.stringify(data));
            data.slogan = 'null';
            data.description = copiedData.slogan;
            data.category = copiedData.description;
            data.default_price = copiedData.category;
        }

        if (typeof data.default_price === 'string' && data.default_price.includes('$')) {
            data.default_price = data.default_price.replace('$', '');
        }

        data.id = Number(data.id);
        data.default_price = Number(data.default_price);

        if (data.id && data.name && data.slogan && data.description && data.category && (data.default_price === 0 || data.default_price)) {

            const values = [{'id': data.id, 'name': data.name, 'slogan': data.slogan, 'description': data.description, 'category': data.category, 'default_price': data.default_price}];
            const query = pgp.helpers.insert(values, cs);
            db.none(query);
        } else {
            var stringToWrite = `${data.id}, ${data.name}, ${data.slogan}, ${data.description}, ${data.category}, ${data.default_price}`;
            fs.appendFile('problemProducts.csv', stringToWrite, { flag: 'a'}, err => { if (err) console.log(err); console.log(`writing file with ${data.id}`) });
        }
    }
    catch(err) {
        console.log(err);
    }
})
.on('end',function(){
    console.log('done');
});
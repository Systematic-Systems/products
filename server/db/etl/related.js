const pgp = require('pg-promise')();
const db = require('../index.js');
const fs = require('fs');
const csv = require('csv-parser');

// RELATED IMPORT
const cs = new pgp.helpers.ColumnSet(['id', 'current_product_id', 'related_product_id'], {table: 'related'});
fs.createReadStream('../../../data/related.csv')
.pipe(csv())
.on('data', function(data){
    try {
        if (data.id && data.current_product_id && data.related_product_id) {
            const values = [{'id': data.id, 'current_product_id': data.current_product_id, 'related_product_id': data.related_product_id}];
            const query = pgp.helpers.insert(values, cs);
            db.none(query)
            .catch(error => {
                var stringToWrite = `${data.id}, ${data.current_product_id}, ${data.related_product_id} \n`;
                fs.writeFile('problemRelated.csv', stringToWrite, { flag: 'a+'}, err => { if (err) console.log(err) });
            })
        } else {
            var stringToWrite = `${data.id}, ${data.current_product_id}, ${data.related_product_id} \n`;
            fs.writeFile('problemRelated.csv', stringToWrite, { flag: 'a+'}, err => { if (err) console.log(err) });
        }
    }
    catch(err) {
        console.log('we got an err ', err);
    }
})
.on('end',function(){
    //some final operation
    console.log('done');
});
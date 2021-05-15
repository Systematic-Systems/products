const pgp = require('pg-promise')();
const db = require('../index.js');
const fs = require('fs');
const csv = require('csv-parser');

// // SKUS IMPORT
const cs = new pgp.helpers.ColumnSet(['id', 'styleid', 'size', 'quantity'], {table: 'skus'});

fs.createReadStream('../../../data/xal.csv')
.pipe(csv(['id', 'styleId', 'size', 'quantity']))
.on('data', function(data) {
    try {
        if (data.quantity === undefined) {
            // we have missing columns!
            var copiedData = JSON.parse(JSON.stringify(data));
            data.quantity = copiedData.size;
            data.size = "One Size";
        }

        if (data.id && data.styleId && data.size && (data.quantity === 0 || data.quantity)) {
            const values = [{'id': data.id, 'styleid': data.styleId, 'size': data.size, 'quantity': data.quantity}];
            const query = pgp.helpers.insert(values, cs);
            db.none(query)
            .catch(error => {
                var stringToWrite = `${data.id}, ${data.styleId}, ${data.size}, ${data.quantity} \n`;
                fs.writeFile('problemSkus.csv', stringToWrite, { flag: 'a+'}, err => { if (err) console.log(err) });
            })
        } else {
            var stringToWrite = `${data.id}, ${data.styleId}, ${data.size}, ${data.quantity} \n`;
            fs.appendFile('problemSkus.csv', stringToWrite, { flag: 'a+'}, err => { if (err) console.log(err)});
        }
    }
    catch(err) {
        //error handler
        console.log('we got an err ', err);
    }
})
.on('end',function(){
    //some final operation
    console.log('done');
});
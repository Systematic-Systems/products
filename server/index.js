const express = require('express');
const db = require('./db/index.js');
const app = express();
const port = 3000;

// app.get('/products/:page?/:count?', (req, res) => {
//   let page = req.params.page || 1;
//   let count = req.params.count || 5;
//   db.query(`SELECT * FROM product ORDER BY id ASC LIMIT ${count} OFFSET ${(count * page) - count}`)
//   .then(response => res.send(response))
//   .catch(err => console.log('error getting products'))
// })

app.get('/products/:product_id', (req, res) => {
  let id = req.params.product_id;
  db.task('get-everything', async t => {
    const details = await t.one(`SELECT * FROM product WHERE id=${id}`);
    const features = await t.many(`SELECT feature, value FROM features WHERE product_id=${id}`);
    details.features = features;
    return details;
  })
  .then(response => {
    res.send(response);
  })
  .catch(err => {
    console.log('unable to get product id info', err);
    res.send(err);
  });
})

app.get('/products/:product_id/styles', (req, res) => {
  let id = req.params.product_id;
  db.query(`SELECT * FROM styles WHERE productid=${id}`)
  .then(async styles => {
    let allStyles = [];
    for await (style of styles) {
      await db.query(`SELECT thumbnail_url, url FROM photos WHERE styleid=${style.id}`)
      .then(photos => {
        style.photos = photos;
        allStyles.push(style);
      })
      .catch(err => console.log(`unable to get photos for ${style.id}`, err))
    }
    return allStyles;
  })
  .then(response => res.send(response))
  .catch(err => {
    console.log('unable to get product id info', err);
    res.send(err);
  });
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
})

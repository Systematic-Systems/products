const express = require('express');
const db = require('./db/index.js');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  db.query('SELECT * FROM product WHERE id=5')
    .then(response => console.log('success: ', response))
    .catch(err => console.log('error getting data'))
    .then(res.send('hello'));
})

// app.get('/products', (req, res) => {

// })

// app.get(`/products/${id}`, (req, res));

// app.get(`/products/${id}/styles`, (req, res));

// app.get(`/products/${id}/styles/related`, (req, res));

// app.get(`/reviews/meta`, (req, res));

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
})

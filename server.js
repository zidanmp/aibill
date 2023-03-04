const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb+srv://zidanmp786:tB9NwM18wtzgYmyr@cluster0.vwt602a.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected!');
    app.listen(port, () => console.log(`Server listening on port ${port}!`));
  })
  .catch((err) => console.log(err));

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Product = mongoose.model('Product', productSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/product', (req, res) => {
  const product = new Product(req.body);

  product.save()
    .then(() => res.send('Product is added to the database'))
    .catch((err) => console.log(err));
});

app.get('/product', (req, res) => {
  Product.find()
    .then((products) => res.json(products))
    .catch((err) => console.log(err));
});

app.get('/product/:id', (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Product not found');
      }
    })
    .catch((err) => console.log(err));
});

app.delete('/product/:id', (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.send('Product is deleted'))
    .catch((err) => console.log(err));
});

app.post('/product/:id', (req, res) => {
  Product.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.send('Product is edited'))
    .catch((err) => console.log(err));
});

const orderSchema = new mongoose.Schema({
  customer: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  total: Number,
});

const Order = mongoose.model('Order', orderSchema);

app.post('/checkout', (req, res) => {
  const order = new Order(req.body);

  order.save()
    .then(() => res.redirect(302, 'https://assettracker.cf'))
    .catch((err) => console.log(err));
});

app.get('/checkout', (req, res) => {
  Order.find().populate('products')
    .then((orders) => res.json(orders))
    .catch((err) => console.log(err));
});

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  department:{
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
},
 {timestamps:true}
);

const Product = mongoose.model('Sale', productSchema);
module.exports = Product;
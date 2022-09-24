const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name of a product'],
    trim: true,
    maxlength: [100, 'Product name not exceed than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description to the product entry'],
    maxlength: [4000, 'Description must not exceed 4000 characters'],
  },
  price: {
    type: String,
    required: [true, 'Price field must not leave empty'],
    maxlength: [8, 'Price length can not exceed 8 characters'],
  },
  discountPrice: {
    type: String,
    maxlength: [4, 'Discount length can not exceed 4 characters'],
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please add a category of your product'],
  },
  stock: {
    type: Number,
    required: [true, 'Please add a category of product stock'],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required:true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = mongoose.model('Product', productSchema)

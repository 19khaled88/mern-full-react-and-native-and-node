const Product = require('../models/ProductModel')

//single product server
exports.getSingleProductService = async (id) => {
  const singleProduct = await Product.findById(id)
  return singleProduct
}

//all product service
exports.getProductServices = async (queryObject, sortQuery) => {
  const { key } = queryObject
  const products = await Product.find({})
    // .where('name')
    // .equals(queryObject.key)

    .skip(sortQuery.skip)
    .limit(sortQuery.limit)
    .sort(sortQuery.sort)
    .select(sortQuery.fields)
  const totalProducts = products.length
  //   const totalProducts = await Product.countDocuments(queryObject.key)
  return { products, totalProducts }
}

//create product service
exports.createProductService = async (data) => {
  const product = Product.create(data)
  return product
}

//update produc service
exports.updateProductService = async (id, body) => {
  Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    useUnified: false,
  })
}

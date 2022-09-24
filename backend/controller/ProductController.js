const Product = require('../../backend/models/ProductModel.js')
const {
  getProductServices,
  getSingleProductService,
  createProductService,
  updateProductService,
} = require('../services/product.services.js')

//single product
exports.singleProduct = async (req, res, next) => {
  try {
    const product = await getSingleProductService(req.params.id)
    res.status(200).json({
      success: true,
      message: 'Single product',
      data: product,
    })
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: 'Product is not found!',
    //   error: error.message,
    // })
    next({
      status: 404,
      message: 'Product for given id not found',
    })
  }

  //   const product = await Product.findById(req.params.id)
  //   if (!product) {
  //     return res.status(500).json({
  //       success: false,
  //       message: 'Product is not found!',
  //     })
  //   }

  //   res.status(200).json({
  //     success: true,
  //     message: 'Single product',
  //     data: product,
  //   })
}

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    let queryObject = { ...req.query }
    const excludeFileds = ['sort', 'page', 'limit']
    excludeFileds.forEach((element) => delete queryObject[element])

    const sortQuery = {}

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join('')
      sortQuery.sort = sortBy
    }
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join('')
      sortQuery.fields = fields
    }
    if (req.query.page) {
      const { page = 1, limit = 5 } = req.query
      const skip = (page - 1) * (limit * 1) // multiply by will make string into number
      sortQuery.skip = skip
      sortQuery.limit = parseInt(limit)
    }

    const products = await getProductServices(queryObject, sortQuery)
    res.status(200).json({
      status: 'Success',
      totalProduct: products.totalProducts,
      data: products.products,
    })
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      success: false,
      message: 'No product has been found!',
    })
  }

  //   let result
  //   if (req.query.key) {
  //     const products = await Product.find({
  //       $or: [
  //         { name: { $regex: req.query.key } },
  //         { size: { $regex: req.query.key } },
  //         { category: { $regex: req.query.key } },
  //       ],
  //     })
  //     result = products
  //   } else {
  //     const products = await Product.find({})
  //     result = products
  //   }

  //   res.status(200).json({
  //     message: 'Found product list',
  //     resultCount: result.length,
  //     data: result,
  //   })
}

// search product
exports.searchProduct = async (req, res, next) => {
  let data = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { size: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  })
  res.status(200).json({
    success: true,
    resultCount: data.length,
    result: data,
  })
}

//create Product
exports.createProduct = async (req, res, next) => {
  try {
    const product = createProductService(req.body)
    res.status(200).json({
      success: true,
      message: 'New product inserted to the database',
      product,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failure occured in inserting new product',
    })
  }

  //   const product = await Product.create(req.body)
  //   res.status(200).json({
  //     success: true,
  //     message: 'New product inserted to the database',
  //     product,
  //   })
}

// update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await updateProductService(req.params.id, req.body)
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Product is not found!',
    })
  }

  //   let product = await Product.findById(req.params.id)
  //   console.log(product.images[0]['url'])
  //   if (!product) {
  //     return res.status(500).json({
  //       success: false,
  //       message: 'Product is not found!',
  //     })
  //   }
  //   product = await Product.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //     runValidators: true,
  //     useUnified: false,
  //   })
  //   res.status(200).json({
  //     success: true,
  //     message: 'Product updated successfully',
  //     data: product,
  //   })
}

// delete product
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'Product not found in query',
    })
  }
  await Product.deleteOne()
  res.status(200).json({
    success: true,
    message: 'Product has been deleted successfully',
  })
}

//review
exports.createProductReview = async (req, res, next) => {
  const { rating, comment, productId, userName, userId } = req.body

  const review = {
    userName,
    userId,
    rating,
    comment,
  }
  const product = await Product.findById(userId)

  // const isViewed=product.reviews.find((rev)=>rev.user.toString() === req.)
}

const express = require('express')

const productController = require('../controller/ProductController')
const { isAuthenticatedUser, isAuthorized } = require('../middleware/auth')
const router = express.Router()

router.route('/show').get(productController.getAllProducts) //route is '/api/v2/product/show' ( show all or searched product )

router.route('/search/:key').get(productController.searchProduct) //route is '/api/v2/product/search/:key' ( show searched products )

router
  .route('/create')
  .post(
    isAuthenticatedUser,
    isAuthorized('admin'),
    productController.createProduct,
  ) //route is '/api/v2/product/create' ( create new product entry )

router.route('/single/:id').get(productController.singleProduct) //route is '/api/v2/product/:id' ( single product find )
//   .patch(updateProduct) //update product by id
//   .delete(deleteProduct) //delete produuct by id

router
  .route('/update/:id')
  .patch(isAuthenticatedUser, isAuthorized, productController.updateProduct) //route is '/api/v2/product/update/:id' ( update product )

router
  .route('/delete/:id')
  .delete(isAuthenticatedUser, isAuthorized, productController.deleteProduct) //route is '/api/v2/product/delete/:id' ( delete product )

module.exports = router

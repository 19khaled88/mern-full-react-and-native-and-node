const express = require('express')
const order = require('../controller/OrderController')
const { isAuthorized, isAuthenticatedUser } = require('../middleware/auth')
const router = express.Router()

router.route('/createOrder').post(isAuthenticatedUser, order.createOrder)
router.route('/singleOrders').get(isAuthenticatedUser, order.getSingleOrder)
router.route('/allOrders').get(isAuthenticatedUser, order.getAllOrder)
router.route('/adminOrders').get(isAuthorized, order.getAdminAllOrders)
router.route('/updateByAdmin').patch(isAuthorized, order.updateOrderByAdmin)
router.route('/delete').delete(isAuthorized, order.deleteOrder)
module.exports = router

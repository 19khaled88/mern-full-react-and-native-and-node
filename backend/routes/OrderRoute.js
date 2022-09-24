const express = require('express')
const { createOrder } = require('../controller/OrderController')
const router = express.Router()

router.route('/createOrder').post(createOrder)

module.exports = router

const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')

//create order
exports.createOrder = async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  })
  if (!order) {
    return res.send('Order has not been placed successfully')
  }
  res.status(200).json({
    success: true,
    order,
  })
}

//get single order
exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'user email',
  )
  if (!order) {
    return res.send('Desired order info not found')
  }
  res.send({
    success: true,
    order,
  })
}

//get all orders

exports.getAllOrder = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
  res.status(200).json({
    success: true,
    orders,
  })
}

//get all order by admin
exports.getAdminAllOrders = async (req, res, next) => {
  const orders = await Order.find({})

  let totalAmount = 0
  orders.forEach((order) => {
    totalAmount += order.totalPrice
  })

  res.status(200).json({
    success: true,
    totalAmount: totalAmount,
    orders: orders,
  })
}

//update orders
exports.updateOrderByAdmin = async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return res.send('No order found with this id')
  }

  if (order.orderStatus === 'Delivered') {
    return res.send('Your order has aleary been delivered to your address')
  }

  if (req.body.status === 'Shipped') {
    order.orderItems.forEach(async (order) => {
      await updateStock(order.product, order.quantity)
    })
  }

  order.orderStatus = req.body.status

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now()
  }

  await order.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
  })
}

async function updateStock(id, quantity) {
  const product = await Product.findById(id)

  product.stock -= quantity

  await product.save({ validateBeforeSave: false })
}

// delete order by admin

exports.deleteOrder = async (req, res, next) => {
  const orders = await Order.find()
  const order = await Order.findById(req.params.id)

  if (!order) {
    return res.send('order not found with this id')
  }

  await order.remove()
  // let totalAmount = 0
  // orders.forEach((order) => {
  //   totalAmount += order.totalPrice
  // })

  res.status(200).json({
    success: true,
  })
}

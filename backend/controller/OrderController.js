const Order = require('../models/OrderModel')

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

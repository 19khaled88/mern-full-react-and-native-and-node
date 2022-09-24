const jwt = require('jsonwebtoken')
const User = require('../../backend/models/UserModel.js')

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return res.send('Please login first')
  }

  const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY)

  req.user = await User.findById(decodedData.id)

  next()
}

exports.isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.send(`${req.user.role} can not access this resources`)
    }
    next()
  }
}

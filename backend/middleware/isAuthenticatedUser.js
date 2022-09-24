const jwt = require('jsonwebtoken')
const User = require('../../backend/models/UserModel.js')

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies

  if (!token) {
    return res.send('Please login first')
  }

  // const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
  // console.log(decodedData)
  // req.user = await User.findById(decodedData.id)

  next()
}

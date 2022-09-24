const User = require('../../backend/models/UserModel.js')
const sendToken = require('../utils/jwtToken.js')
const sendMail = require('../utils/Sendmail.js')
const crypto = require('crypto')
exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body
  try {
    const user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: 'https://test.com', url: 'https://test.com' },
    })
    const token = await user.getJwtToken()
    res.status(200).json({
      success: true,
      data: user,
      token,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      Error: error.message,
    })
  }
}
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
    res.status(200).json({
      success: true,
      totalUser: users.length,
      data: users,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'No user found',
    })
  }
}
//login user
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.send('Please enter your mail & password')
  }
  const user = await User.findOne({ email }).select('password')
  if (!user) {
    return res.send('user is not found with this email & password')
  }

  const isPasswordMatched = await user.comparePassword(password)

  if (!isPasswordMatched) {
    return res.send('user is not found with this password')
  }

  //   const token = await user.getJwtToken()

  //   res.status(201).json({
  //     success: true,
  //     token,
  //   })
  //   res.send('user is valid')
  sendToken(user, 200, res)
}

exports.logout = async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date.now(),
    httpOnly: true,
  })
  res.status(200).json({
    success: true,
    message: 'log out successful',
  })
}

//forget password
exports.fortgetPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.send('This user not found!')
  }

  //get reset token
  const resetToken = await user.getResetToken() //get reset token imported from User Model

  await user.save({
    validateBeforeSave: false,
  })

  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host',
  )}/password/reset/${resetToken}`

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`

  try {
    await sendMail({
      email: user.email,
      subject: 'Reset Password',
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordTime = undefined

    await user.save({
      validateBeforeSave: false,
    })

    res.send('Mail Error: ' + error.message)
  }
}

//reset password
exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTime: { $gt: Date.now() },
  })

  if (!user) {
    return res.send('User not found')
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password not match')
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordTime = undefined
  await user.save()

  sendToken(user, 200, res)
}

//user details
exports.userDetails = async (req, res, next) => {
  const { id } = req.body

  try {
    const user = await User.findById(id)
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.send('Error' + error)
  }
}

//update user password
exports.updatePassword = async (req, res, next) => {
  if (!req.body.newPassword) {
    return res.send('Please provide new password')
  }

  if (!req.body.confirmPassword) {
    return res.send('Please provide confirm password')
  }

  const user = await User.findById(req.body.id).select('+password')

  const isPasswordMatched = await user.comparePassword(req.body.password)

  if (!isPasswordMatched) {
    return res.send('User is not found with this email or password')
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.send('Password not match')
  }

  user.password = req.body.newPassword
  await user.save()

  sendToken(user, 200, res)
}

//update profile
exports.updateProfile = async (req, res, next) => {
  const { id } = req.params
  let newData = {
    name: req.body.name,
    email: req.body.email,
  }
  try {
    const user = await User.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.send('Error:' + error.message)
  }
}

//update user role
exports.updateUserRole = async (req, res, next) => {
  const { id } = req.params
  let newData = {
    role: req.body.role,
  }
  try {
    const user = await User.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.send('Error:' + error.message)
  }
}

//get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    res.send('Error :' + error.message)
  }
}

//get single user
exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.send('Error:' + error.message)
  }
}

//delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (user) {
      res.send({
        success: true,
        message: 'Delete successful',
        user,
      })
    }
  } catch (error) {
    res.send('Error: ' + error.message)
  }
}

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    minLength: [3, 'Min characters 3'],
    maxLength: [15, 'Max characters are 15'],
  },
  email: {
    type: String,
    required: [true, 'Enter your mail'],
    validate: [validator.isEmail, 'Enter valid email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Enter password'],
    minLength: [8, 'Min character are 8'],
    select: false,
  },
  avatar: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  role: { type: String, default: 'user' },
  resetPasswordToken: String,
  resetPasswordTime: Date,
})

//hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

//jwt token
userSchema.methods.getJwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

//forget password
userSchema.methods.getResetToken = async function () {
  // creating token
  const resetToken = await crypto.randomBytes(30).toString('hex')

  //hashing and adding to model
  this.resetPasswordToken = await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordTime = Date.now() + 15 * 60 * 1000

  return resetToken
}

module.exports = mongoose.model('User', userSchema)

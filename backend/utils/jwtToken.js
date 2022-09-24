const sendToken = async (user, statusCode, res) => {
  const token = await user.getJwtToken() // getjwtToken imported from user model

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE + 24 * 60 * 60 * 1000,
    ),
    httpOnly: false,
  }

  //   res.cookie('token', token)
  //   res.json({
  //     token,
  //   })
  res.status(200).cookie('token', token).json({
    success: true,
    user,
    token,
  })
}

module.exports = sendToken

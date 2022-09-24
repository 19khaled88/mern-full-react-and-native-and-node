const ErrorHandler = (Error, req, res, next) => {
  res.status(Error.status || 500)
  res.send({ error: true, message: Error.message || 'Internal server error' })

  //   if (Error.name === 'CastError') {
  //     const message = `Resources not found with this id..Invalid ${Error.path}`

  //   }
}

module.exports = ErrorHandler

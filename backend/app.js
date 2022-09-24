const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
//route imports
const product = require('./routes/ProductRoute')
const user = require('./routes/UserRoute')
const order = require('./routes/OrderRoute')
app.use('/api/v2/product', product)
app.use('/api/v2/user', user)
app.use('/api/v2/order',order)
app.use(errorHandler)

module.exports = app

const AdminRouter = require('express').Router();

const ProductRouter = require('./product.routes')
const BookingRouter = require('./booking.routes')

AdminRouter.use('/product', ProductRouter)
AdminRouter.use('/booking', BookingRouter)

module.exports = AdminRouter


const AppRouter = require('express').Router();

const ProductRouter = require('./product.routes')
const CartRouter = require('./cart.routes')
const BookingRouter = require('./booking.routes')

AppRouter.use('/product', ProductRouter)
AppRouter.use('/cart', CartRouter)
AppRouter.use('/booking', BookingRouter)


module.exports = AppRouter
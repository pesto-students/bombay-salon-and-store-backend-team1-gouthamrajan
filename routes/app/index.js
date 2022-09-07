const AppRouter = require('express').Router();

const ProductRouter = require('./product.routes')
const CartRouter = require('./cart.routes')
const BookingRouter = require('./booking.routes')
const OrderRouter = require('./order.routes')
const UserRouter = require('./user.routes');

const passport = require('passport');
const passportConfig = require('../../passport/passport.config')

const QueryModel = require('../../models/Queries/schema');
const { verifyPayment } = require('../../integrations/razorpay');

AppRouter.use('/', ProductRouter)
AppRouter.use('/cart', passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }), CartRouter)

AppRouter.use('/booking',
	passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
	BookingRouter)

AppRouter.use('/order',
	passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
	OrderRouter)
AppRouter.use('/user', UserRouter)
AppRouter.post('/verify-payment', verifyPayment)
AppRouter.post('/contact-us', async (req, res, next) => {
	try {
		const { body } = req;
		const query = new QueryModel(body);
		await query.save();
		return res.json({ query, message: 'Query captured successfully' })
	} catch (error) {

	}
})

module.exports = AppRouter
const CartController = require('../../controllers/cart.controller')
const passport = require('passport');
const passportConfig = require('../../passport/passport.config')
const router = require('express').Router()

router.route('/')
	.get(
		passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
		CartController.getCart)
	.post(
		passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
		CartController.cartHandler)




module.exports = router
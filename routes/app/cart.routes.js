const CartController = require('../../controllers/cart.controller')

const router = require('express').Router()

router.route('/')
	.get(CartController.getCart)
	.post(CartController.cartHandler)




module.exports = router
const router = require('express').Router()
const OrderController = require('../../controllers/order.controller')

router.post('/create', OrderController.createOrder)
router.get('/:order_id', OrderController.getOrder)


module.exports = router
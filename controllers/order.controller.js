const OrderModel = require('../models/Order/schema');
const ProductModel = require('../models/Product/schema');
const RazorpayService = require('../integrations/razorpay');

exports.createOrder = async (req, res, next) => {
	try {
		const { body } = req;
		const product = await ProductModel.findById(body.product_id);
		if(!product) return res.status(400).json({ message: 'Invalid product'})
		if (product.type === 'service') {
			return res.status(400).json({
				message: 'Cannot create order for service'
			})
		}
		body.amount = body.amount || product.price; 
		const orderObj = {
			...body,
			user_id: req.user.id,
			product: product._id
		}
		const order = new OrderModel(orderObj);
		await order.save();
		const _order = await RazorpayService.createOrder(body.amount, 'order'); 
		return res.status(201).json({
			order, _order
		})
	} catch (error) {
		console.log(error);
	}

}

exports.getOrder = async (req, res, next) => {
	try {
		const order = await OrderModel.findById(req.params.order_id);
		if(!order) return res.status(404).json({ message: 'Order not found'})
		return res.status(200).json({ order })
	} catch (error) {
		next(error)
	}
}
const AdminRouter = require('express').Router();

const ProductRouter = require('./product.routes')
const BookingRouter = require('./booking.routes');
const UserModel = require('../../models/User/schema');
const parser = require('../../middlewares/multer.middlerware')

AdminRouter.use('/product', ProductRouter)
AdminRouter.use('/booking', BookingRouter)

AdminRouter.post('/add-stylist', async (req, res, next) => {
	try {
		const { body } = req;
		let user = {
			...body,
			role: 'STYLIST'
		}
		user = await new UserModel(user).save();
		return res.status(200).json({ user, message: 'Stylist added successfully' })
	} catch (error) {
		next(error)
	}
})

AdminRouter.post('/upload-image', parser.single('image'), (req, res, next) => {
	try {
		res.json({
			image_url: req.file.path
		});
	} catch (error) {
		console.log(error)
		next(error)
	}
})

module.exports = AdminRouter



const BookingModel = require('../models/Booking/schema');
const ProductModel = require('../models/Product/schema');
const RazorpayService = require('../integrations/razorpay');

const {startOfDay, endOfDay } = require('date-fns')
exports.createBooking = async (req, res, next) => {
	try {
		const { body } = req;
		const service = await ProductModel.findById(body.service.id);
		if (service.type === 'product') {
			return res.status(400).json({
				message: 'Cannot create bookings for products'
			})
		}
		const serviceProviderBookings = await getBookingsForServiceProviderByDate(body.service_provider, body.date);
		const alreadyBookedBooking = serviceProviderBookings.find(booking => {
			booking.time_slot === body.time_slot
		});
		if(alreadyBookedBooking) {
			return res.status(400).json({
				message: `Service provider not available for the time slot: ${body.time_slot} `
			})
		}
		const booking = new BookingModel(body);
		const order = await RazorpayService.createOrder(body.amount);
		return res.status(201).json({
			booking, order
		})
	} catch (error) {
		next(error)
	}

}

exports.getBooking = async (req, res, next) => {
	try {
		const booking = await BookingModel.findById(req.params.booking_id);
		return res.status(200).json({ booking })
	} catch (error) {
		next(error)
	}
}

exports.getBookingsForUser = async (req, res, next) => {
	try {
		const bookings = await BookingModel.find({
			user_id: req.user.user_id
		})
		return res.status(200).json({ booking })
	} catch (error) {
		next(error)
	}
}

exports.getBookingsForServiceProvider = async (req, res, next) => {
	try {
		const bookings = await BookingModel.find({
			service_provider: req.user.user_id
		})
		return res.status(200).json({ booking })
	} catch (error) {
		next(error)
	}
}

const getBookingsForServiceProviderByDate = async (service_provider_id, date) => {
	const bookings = await BookingModel.find({
		service_provider: service_provider_id,
		date: {
			$gte: startOfDay(new Date(date)),
    	$lte: endOfDay(new Date(date))
		}
	})
	return bookings;
}
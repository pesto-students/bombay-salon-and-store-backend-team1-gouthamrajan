const BookingModel = require('../models/Booking/schema');
const ProductModel = require('../models/Product/schema');
const RazorpayService = require('../integrations/razorpay');

const { startOfDay, endOfDay } = require('date-fns');
const UserModel = require('../models/User/schema');
exports.createBooking = async (req, res, next) => {
	try {
		const { body } = req;
		const service = await ProductModel.findById(body.service_id);
		if(!service) return res.status(400).json({ message: 'Invalid service'})
		if (service.type === 'product') {
			return res.status(400).json({
				message: 'Cannot create bookings for products'
			})
		}
		const serviceProviderBookings = await getBookingsForServiceProviderByDate(body.service_provider, body.date);
		const alreadyBookedBooking = serviceProviderBookings.find(booking => {
			if (booking.time_slot === body.time_slot) return booking;
		});
		if (alreadyBookedBooking) {
			return res.status(400).json({
				message: `Service provider not available for the time slot: ${body.time_slot} `
			})
		}
		body.amount = body.amount || service.price;
		const bookingObj = {
			...body,
			user_id: req.user.id,
			service: service._id
		}
		const booking = new BookingModel(bookingObj);
		const _order = await RazorpayService.createOrder(body.amount, 'booking');
		booking.rzp_order_id = _order.id;
		await booking.save();
		return res.status(201).json({
			booking, _order
		})
	} catch (error) {
		console.log(error);
	}

}

exports.getBooking = async (req, res, next) => {
	try {
		const booking = await BookingModel.findById(req.params.booking_id);
		if (!booking) return res.status(404).json({ message: 'Booking not found' })
		return res.status(200).json({ booking })
	} catch (error) {
		next(error)
	}
}

exports.getBookingsForUser = async (req, res, next) => {
	try {
		const bookings = await BookingModel.find({
			user_id: req.user.id
		})
		return res.status(200).json({ bookings })
	} catch (error) {
		next(error)
	}
}

exports.getBookingsForServiceProvider = async (req, res, next) => {
	try {
		const bookings = await BookingModel.find({
			service_provider: req.user.id,
			payment_status: "paid"
		})
		return res.status(200).json({ bookings })
	} catch (error) {
		next(error)
	}
}

const getBookingsForServiceProviderByDate = async (service_provider_id, date) => {
	const bookings = await BookingModel.find({
		service_provider: service_provider_id,
		payment_status: "paid",
		date: {
			$gte: startOfDay(new Date(date)),
			$lte: endOfDay(new Date(date))
		}
	})
	return bookings;
}
exports.fetchStylists = async (req, res, next) => {
	try {
		const stylists = await UserModel.find({ role: 'STYLIST' });
		return res.json({ stylists })
	} catch (error) {
		next(error)
	}

}
exports.getBookingsForStylistByDate = async (req, res, next) => {
	try {
		const { stylist_id, date } = req.body;
		const bookings = await getBookingsForServiceProviderByDate(stylist_id, date);
		return res.json({ bookings })
	} catch (error) {
		next(error)

	}
}
const router = require('express').Router()
const BookingController = require('../../controllers/booking.controller')
const { verifyPayment } = require('../../integrations/razorpay')

// get all products
router.get('/', BookingController.getBookingsForServiceProvider)


router.post('/verify-payment', verifyPayment)


module.exports = router
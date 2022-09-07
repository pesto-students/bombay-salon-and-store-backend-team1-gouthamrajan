const router = require('express').Router()
const BookingController = require('../../controllers/booking.controller')

router.get('/', BookingController.getBookingsForUser)
router.get('/:booking_id', BookingController.getBooking)
router.post('/create', BookingController.createBooking)


module.exports = router
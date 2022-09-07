const router = require('express').Router()
const BookingController = require('../../controllers/booking.controller')

router.get('/', BookingController.getBookingsForUser)
router.post('/create', BookingController.createBooking)
router.get('/stylists', BookingController.fetchStylists)
router.post('/stylist-availability', BookingController.getBookingsForStylistByDate)
router.get('/:booking_id', BookingController.getBooking)


module.exports = router
const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
	id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
}, {
	_id: false
})
serviceSchema.virtual('details',{
	ref: 'product',
	localField: 'id',
	foreignField: '_id',
	justOne: true
});

const bookingSchema = new mongoose.Schema({
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
	service: { type: serviceSchema, required: true },
	date: { type: Date, required: true },
	time_slot: { type: String, required: true },
	service_provider: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
	amount: {type: Number, default: 0 },
	payment_status: { type : String, default: 'unpaid' },
	payment_details: { type: Object, default: {} },
	rzp_order_id: { type: String }
}, {
	timestamps: true,
})

bookingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

bookingSchema.set('toJSON', {
  virtuals: true,
	versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});
const BookingModel = mongoose.model('booking', bookingSchema);

module.exports = BookingModel

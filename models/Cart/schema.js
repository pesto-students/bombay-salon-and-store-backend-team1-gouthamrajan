const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
	id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
	cart_quantity: { type : Number, required: true }
}, {
	_id: false
})
productSchema.virtual('details',{
	ref: 'product',
	localField: 'id',
	foreignField: '_id',
	justOne: true
});

productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

const cartSchema = new mongoose.Schema({
	products: {
		type: [productSchema],
		default: []
	},
	user_id: { type: String, required: true }
}, {
	timestamps: true,
})

cartSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

cartSchema.set('toJSON', {
  virtuals: true,
	versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});
const CartModel = mongoose.model('cart', cartSchema);

module.exports = CartModel
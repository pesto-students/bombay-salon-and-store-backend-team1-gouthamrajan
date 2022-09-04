const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	type: { type: String, required: true },
	image_url: { type: String, required: true },
	category: { type: String, required: true },
	quantity: { type: Number, required: true, default: 0 },
	duration: { type: String },
	price: { type: Number, required: true }
}, {
	timestamps: true,
})

productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
	versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});
const ProductModel = mongoose.model('product', productSchema);

module.exports = ProductModel
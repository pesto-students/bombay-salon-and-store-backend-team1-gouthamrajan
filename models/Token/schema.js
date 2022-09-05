const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
	user_id: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
	token: { type: String, required: true },
	expires_in: {type: Date, default:new Date(new Date(Date.now()).getTime() + 60 * 60 * 24 * 1000) }
})


tokenSchema.virtual('id').get(function () {
	return this._id.toHexString();
});


tokenSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) { delete ret._id }
});
const TokenModel = mongoose.model('token', tokenSchema);

module.exports = TokenModel
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: { type: String}
})
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
	versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel
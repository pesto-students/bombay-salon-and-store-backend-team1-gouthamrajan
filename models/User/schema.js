const mongoose = require('mongoose');
const bcyrpt = require("bcrypt");

// name email phone gender password confirm password
const userSchema = new mongoose.Schema({
	name: { type: String },
  role: { type: String },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true }
})

userSchema.pre("save", async function(next) {
  try {
    const salt = await bcyrpt.genSalt(10);
    const hashedPassword = await bcyrpt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Change Password
userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcyrpt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


userSchema.set('toJSON', {
  virtuals: true,
	versionKey:false,
  transform: function (doc, ret) {   delete ret._id; delete ret.password  }
});
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel
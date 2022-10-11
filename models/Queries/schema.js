const mongoose = require('mongoose')


const queriesSchema = new mongoose.Schema({
	name: { type: String },
	description: { type: String, required: true },
	email: { type: String }
}, {
	timestamps: true,
})

queriesSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

queriesSchema.set('toJSON', {
  virtuals: true,
	versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});
const QueryModel = mongoose.model('query', queriesSchema);

module.exports = QueryModel
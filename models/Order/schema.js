const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
  },
  {
    _id: false,
  }
);
productSchema.virtual("details", {
  ref: "product",
  localField: "id",
  foreignField: "_id",
  justOne: true,
});

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: { type: productSchema, required: true },
    amount: { type: Number, default: 0 },
    payment_status: { type: String, default: "unpaid" },
    payment_details: { type: Object, default: {} },
    rzp_order_id: { type: String },
  },
  {
    timestamps: true,
  }
);

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;

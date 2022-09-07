const Razorpay = require("razorpay");
const shortid = require("shortid");
const OrderModel = require("../models/Booking/schema");
const BookingModel = require("../models/Booking/schema");
const CartModel = require("../models/Cart/schema");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (amount, order_type) => {
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `${order_type}:${shortid.generate()}`,
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const SECRET = "tbss_payment_verification_secret";
    const crypto = require("crypto");
    const shasum = crypto.createHmac("sha256", SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      // process it  
      const { receipt } = req.body;
      const paymentType = receipt.split(":")[0]; // will be either order or booking
      let paymentEntity;
      if (paymentType === "order") {
        paymentEntity = await OrderModel.findOne({
          "payment_details.receipt": req.body.receipt,
        });
      } else {
        paymentEntity = await BookingModel.findOne({
          "payment_details.receipt": req.body.receipt,
        });
      }
      if (!paymentEntity)
        return res.status(400).json({ message: "Invalid booking/order id" });
      paymentEntity.payment_status = "paid";
      paymentEntity.payment_details = req.body;
      await paymentEntity.save();
      // clear cart after payment success;
      const userCart = await CartModel.findOne({
        user_id: paymentEntity.user_id,
      });
      await userCart.delete();
      return res.json({ status: "ok" });
    } else {
      // pass it
      console.log("signature not matching");
      return res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    throw new Error(error);
  }
};

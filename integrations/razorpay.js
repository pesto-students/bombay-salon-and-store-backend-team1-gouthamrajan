const Razorpay = require("razorpay");
const shortid = require("shortid");
const OrderModel = require("../models/Order/schema");
const BookingModel = require("../models/Booking/schema");
const UserModel = require("../models/User/schema");
const sendEmail = require("./email");
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
      const { payload } = req.body;
      console.log(payload.payment.entity.order_id);
      const { order_id } = payload.payment.entity;
      let paymentEntity;
      let isOrder = true;
      paymentEntity = await OrderModel.findOne({
        rzp_order_id: order_id,
      });
      if (!paymentEntity) {
        isOrder = false;
        paymentEntity = await BookingModel.findOne({
          rzp_order_id: order_id,
        });
      }

      if (!paymentEntity)
        return res.status(400).json({ message: "Invalid booking/order id" });
      paymentEntity.payment_status = "paid";
      paymentEntity.payment_details = req.body;
      await paymentEntity.save();
      const user = await UserModel.findById(paymentEntity.user_id);
      sendEmail(
        user.email,
        "Thank you for your purchase with TBSS",
        isOrder
          ? {}
          : { date: `${paymentEntity.date} ${paymentEntity.time_slot}` },
        isOrder
          ? "./integrations/email/templates/orderSuccess.handlebars"
          : "./integrations/email/templates/bookingSuccess.handlebars"
      );
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
    console.log(error);
    throw new Error(error);
  }
};

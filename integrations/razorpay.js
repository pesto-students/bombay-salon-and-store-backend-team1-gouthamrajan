const Razorpay = require("razorpay");
const shortid = require("shortid");
const BookingModel = require("../models/Booking/schema");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (amount) => {
  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: shortid.generate(),
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
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
      const booking = await BookingModel.findOne({
        "payment_details.receipt": req.body.receipt,
      });
      booking.payment_status = "paid";
      booking.payment_details = req.body;
      await booking.save();
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

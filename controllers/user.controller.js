const User = require("../models/User/schema");
const { validateRegisterUser } = require("../models/User/validators");
const { generateToken } = require("../helpers/jwt");
const bcrypt = require("bcrypt");
const TokenModel = require("../models/Token/schema");
const sendEmail = require("../integrations/email");
const crypto = require("crypto");
const { handleJoiError } = require("../helpers/errorHandler");

exports.registerUser = async (req, res, next) => {
  try {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      handleJoiError(error, res);
      return;
    }
    const { name, gender, confirm_password, email, password, mobile } =
      req.body;
    if (password !== confirm_password)
      return res.status(400).json({ message: "Passwords do not match" });
    const user = await new User({
      name,
      email,
      mobile,
      password,
      role: "USER",
      gender,
    }).save();
    const token = generateToken(user);
    res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    // if we reach here means user is valid from passport
    const user = req.user;
    const logged = await User.findById(user.id);
    console.log(logged);
    // console.log(user);
    const token = generateToken(user);
    res.status(200).json({
      token,
      user,
    });
  } catch (e) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User does not exists!" });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.sendResetPasswordLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: `User with ${email} does not exist` });
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);
    await new TokenModel({
      user_id: user._id,
      token: hash,
    }).save();

    const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;
    await sendEmail(
      user.email,
      "Reset Password for TBSS",
      { link },
      "./integrations/email/templates/requestResetPassword.handlebars"
    );
    return res.status(200).json({ message: "Link sent successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.verifyResetPasswordLink = async (req, res, next) => {
  try {
    const { token, id, new_password } = req.body;

    const validToken = await TokenModel.findOne({ user_id: id });
    if (!validToken) return res.status(400).json({ message: "Invalid link" });
    const isSame = await bcrypt.compare(token, validToken.token);
    if (!isSame) return res.status(400).json({ message: "Invalid link" });
    const isExpired = new Date() > validToken.expires_in;
    if (isExpired) return res.status(400).json({ message: "Link expired" });
    const user = await User.findById(id);
    user.password = new_password;
    await user.save();
    await validToken.delete(); // remove token from db
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

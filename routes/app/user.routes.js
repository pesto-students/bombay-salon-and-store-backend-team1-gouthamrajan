const express = require("express");
const passport = require("passport");
const passportConfig = require("../../passport/passport.config");

const router = express.Router();

const userController = require("../../controllers/user.controller");


router
  .get("/session",
    passport.authenticate(passportConfig.STRATEGY_JWT, { session: false }),
    userController.getUserById
  );

router.post("/register", userController.registerUser);

router
  .post("/login",
    passport.authenticate(passportConfig.METHOD_LOCAL, { session: false }),
    userController.loginUser
  );

router.post('/reset-password-link', userController.sendResetPasswordLink)
router.post('/reset-password-verify', userController.verifyResetPasswordLink)


module.exports = router;

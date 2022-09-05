const JWT = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = user => {
  return JWT.sign(
    {
      iss: "www.tbss.com",
      sub: user._id,
      iat: new Date().getTime()
    },
    JWT_SECRET
  );
};

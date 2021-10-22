"use strict";
const JWT_SECRET = config.get("JWT_SECRET");
const JWT = require(`jsonwebtoken`);

module.exports.generateAccessToken = (tokenData) => {
  const options = {
    algorithm: "HS256"
  };
  tokenData["createdAt"] = Date.now();
  let token = JWT.sign(tokenData, JWT_SECRET, options);
  return token;
};

module.exports.decipherToken = (payload) => {
  let { token } = payload;
  return JWT.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      console.error(err);
      return { auth: false };
    }
    else return { data, auth: true };
  });
};


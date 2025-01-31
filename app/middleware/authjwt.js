const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const blacklist = new Set();

/**
 * We can disable JWT for testing convenience.
 */
const isJwtEnabled = () => {
  return config.enableJwt;
}

const addToBlacklist = (token) => {
  if (!config.enableJwt) {
    return;
  }
  blacklist.add(token);
};

const removeFromBlacklist = (token) => {
  blacklist.delete(token);
};

const isTokenBlacklisted = (token) => {
  if (!config.enableJwt) {
    return false;
  }
  return blacklist.has(token);
};

const verifyToken = (req, res, next) => {
  if (!config.enableJwt) {
    next();
    return;
  }
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({
      message: "No token provided!"
    });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(403).send({
      message: "Invalid token!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    console.log("User id and name:", decoded.userId, decoded.username);
    next();
  });
};

module.exports = { isJwtEnabled, verifyToken, addToBlacklist, removeFromBlacklist };

"use strict";
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../users/models");
const { JWT_SECRET } = require("../../config");

const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User.findOne({ username })
    .then(_user => {
      user = _user;
      if (!user) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect username or password"
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect username or password"
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === "LoginError") {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

const options = {
  secretOrKey: JWT_SECRET,
  // Look for the JWT as a Bearer auth header
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
  // Only allow HS256 tokens - the same as the ones we issue
  algorithms: ["HS256"]
};

const jwtStrategy = new JwtStrategy(options, (payload, done) => {
  done(null, payload.user);
});

module.exports = { localStrategy, jwtStrategy };

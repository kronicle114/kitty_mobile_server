"use strict";
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();
const options = { session: false, failWithError: true };

const createAuthToken = user => {
  console.log("creating auth token...");
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

const localAuth = passport.authenticate("local", options);
router.use(bodyParser.json());

//the user provides a username and password to login
router.post("/login", localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  console.log("authToken: ", authToken);
  res.json({ authToken });
});

const jwtAuth = passport.authenticate("jwt", options);

//user exchanges valid JWT for a new one
router.post("/refresh", jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };

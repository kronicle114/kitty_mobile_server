"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("./models");

const router = express.Router();
const jsonParser = bodyParser.json();

/* ====== GET ALL USERS ====== */
// Used in registration validation for duplicate username
router.get("/", (req, res, next) => {
  const { search } = req.query;
  let filter = {};

  if (search) {
    // const re = new RegExp(search, 'i');
    filter.$or = [{ username: search }];
  }

  return User.find(filter)
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

/* ====== POST/CREATE user on /api/users ====== */
router.post("/", jsonParser, (req, res, next) => {
  const requiredFields = ["username", "password"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`missing '${missingField}' in request body`);
    console.log("the issue:", (err.status = 422));
    return next(err);
  }

  const stringFields = ["username", "password", "name"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    const err = new Error(`'${nonStringField}' must be a string`);
    err.status = 422;
    return next(err);
  }

  // Validate username and password and email have no whitespace
  const explicityTrimmedFields = ["username", "password"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error(`'${nonTrimmedField}' cannot have white space.`);
    err.status = 422;
    return next(err);
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { username, password, name = "" } = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this

  // check for duplicate usernames
  return User.find({ username })
    .countDocuments()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "Username already taken",
          location: "username"
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        name
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.code === 11000) {
        err = {
          message: "The username already exists",
          reason: "ValidationError",
          location: "username",
          status: 422
        };
      }
      next(err);
    });
});

module.exports = { router };

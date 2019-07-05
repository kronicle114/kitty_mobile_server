const express = require("express");
const bodyParser = require("body-parser");
const { Cat } = require("./models");
const mongoose = require("mongoose");
const router = express.Router();
const jsonParser = bodyParser.json();

/* ====== GET ALL CATS ====== */
// TO-DO: PROTECT ALL ENDPOINTS SO YOU DONT SEE OTHER USERS CATS :D
router.get("/", (req, res, next) => {
  const { search } = req.query;
  let filter = {};

  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [{ name: re, description: re }];
  }

  return Cat.find(filter)
    .exec()
    .then(docs => res.status(200).json(docs))
    .catch(err => next(err));
});

/* ========== GET ONE CAT BY ID ========== */
router.get("/:catId", (req, res, next) => {
  let { catId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(catId) || catId === "") {
    const err = {
      message: "Missing `catId`",
      reason: "MissingContent",
      status: 400,
      location: "get"
    };
    return next(err);
  }

  Cat.findById(catId)
    .then(data => res.json(data))
    .catch(err => next(err));
});

/* ========== POST A CAT ========== */
router.post("/", jsonParser, (req, res, next) => {
  let { name, age, description } = req.body;

  const requiredFields = ["name", "age", "description"];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`missing '${missingField}' in request body`);
    console.log("the issue:", (err.status = 422));
    return next(err);
  }

  const stringFields = ["name", "description"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    const err = new Error(`'${nonStringField}' must be a string`);
    err.status = 422;
    return next(err);
  }

  const numFields = ["age"];
  const nonNumFields = numFields.find(
    field => field in req.body && typeof req.body[field] !== "number"
  );

  if (nonNumFields) {
    const err = new Error(`'${nonNumFields}' must be a number`);
    err.status = 422;
    return next(err);
  }

  // Validate username and password and email have no whitespace
  const explicityTrimmedFields = ["name"];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    const err = new Error(`'${nonTrimmedField}' cannot have white space.`);
    err.status = 422;
    return next(err);
  }

  const newCat = {
    name,
    age,
    description
  };

  return Cat.create(newCat)
    .then(data =>
      res
        .location(`${req.originalUrl}/${data.catId}`)
        .status(201)
        .json(data)
    )
    .catch(err => next(err));
});

/* ========== CLAIM A PLATE PUT/UPDATE using userId  ========== */
// router.put("/:catId", (req, res, next) => {
//   const { catId } = req.params;
//   let { name, age, description } = req.body;

//   if (!catId) {
//     const err = {
//       message: "Missing `catId`",
//       reason: "MissingContent",
//       status: 400,
//       location: "put"
//     };
//     return next(err);
//   }

//   console.log("catId", catId);
//   return Cat.findOneAndUpdate({ name, age, description }, { _id: catId })
//     .then(data => data)
//     .then(data => {
//       res.json(data);
//     })
//     .catch(err => next(err));
// });

module.exports = { router };

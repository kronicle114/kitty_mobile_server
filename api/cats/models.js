const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: { type: String },
  description: { type: String }
});

CatSchema.set("timestamps", true);

const Cat = mongoose.model("Cat", CatSchema);

module.exports = { Cat };

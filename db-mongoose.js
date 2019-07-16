const mongoose = require("mongoose");
const { DATABASE_URL } = require("./config");
mongoose.Promise = global.Promise;

const dbConnect = (url = DATABASE_URL) => {
  console.log("url heere", DATABASE_URL);
  return mongoose
    .connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .catch(err => {
      console.error("Mongoose failed to connect");
      console.error(err);
    });
};

const dbDisconnect = () => mongoose.disconnect();
const dbGet = () => mongoose;

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};

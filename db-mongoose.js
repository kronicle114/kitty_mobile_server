// "use strict";

// const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

// const { DATABASE_URL } = require("./config");
// console.log("pw: ", DATABASE_URL);
// const dbConnect = (url = DATABASE_URL) => {
//   console.log("url: ", url);
//   return mongoose
//     .connect(url, {
//       useCreateIndex: true,
//       useNewUrlParser: true
//     })
//     .catch(err => {
//       console.error("Mongoose failed to connect");
//       console.error(err);
//     });
// };

// const dbDisconnect = () => {
//   return mongoose.disconnect();
// };

// const dbGet = () => {
//   return mongoose;
// };

// module.exports = {
//   dbConnect,
//   dbDisconnect,
//   dbGet
// };

"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const { DATABASE_URL } = require("./config");

function dbConnect(url = DATABASE_URL) {
  console.log("WR", DATABASE_URL);
  return mongoose
    .connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .catch(err => {
      console.error("Mongoose failed to connect");
      console.error(err);
    });
}

function dbDisconnect() {
  return mongoose.disconnect();
}

function dbGet() {
  console.log("geat");
  return mongoose;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};

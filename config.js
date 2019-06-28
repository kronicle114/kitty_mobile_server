"use strict";

module.exports = {
  PORT: process.env.PORT || 8085,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "mongodb+srv://admin:Kittyserver123%26@kittymobilecluster-5vu4d.mongodb.net/test?retryWrites=true&w=majority",
  // "mongodb://localhost/backend", //switch this with your mongodb atlas url
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || "mongodb://localhost/kitty-backend-test",
  JWT_SECRET: process.env.JWT_SECRET || "really-secret-string",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d"
};

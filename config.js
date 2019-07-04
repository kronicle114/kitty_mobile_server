/* 
 if you get the following error below, this is because you need to whitelist the IP address on mongodb

 Mongoose failed to connect
{ MongoNetworkError: connection 4 to kittymobilecluster-shard-00-00-5vu4d.mongodb.net:27017 closed
    at TLSSocket.<anonymous> (/Users/trisha/native/kitty_mobile_server/node_modules/mongodb-core/lib/connection/connection.js:276:9)
    at Object.onceWrapper (events.js:286:20)
    at TLSSocket.emit (events.js:203:15)
    at _handle.close (net.js:606:12)
    at TCP.done (_tls_wrap.js:388:7)
  name: 'MongoNetworkError',
  errorLabels: [ 'TransientTransactionError' ],
  [Symbol(mongoErrorContextSymbol)]: {} }
*/
require("dotenv").config();
module.exports = {
  PORT: process.env.PORT || 8085,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${
      process.env.CLUSTER_NAME
    }.mongodb.net/test?retryWrites=true&w=majority`,
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || "mongodb://localhost/kitty_development",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY
};

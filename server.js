const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const { error404, error500 } = require("./error-middleware");
const { PORT, CLIENT_ORIGIN } = require("./config");
const { dbConnect } = require("./db-mongoose");
const { router: usersRouter } = require("./users");
const { router: authRouter, localStrategy, jwtStrategy } = require("./auth");

console.log("SERVER PORT: ", PORT);
mongoose.Promise = global.Promise;

// Create an Express application
const app = express();

// logs all requests
app.use(
  morgan(process.env.NODE_ENV === "production" ? "common" : "dev", {
    skip: (req, res) => process.env.NODE_ENV === "test"
  })
);

// Create a static webserver
app.use(express.static("public"));

// Parse request body
app.use(express.json());

//create cat model
const Cat = mongoose.model("Cat", { name: String });

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

cors;
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// backup access headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.send(204);
  }
  next();
});

// Mount routers
app.get("/api/cheeses", (req, res, next) => {
  console.log("meep");
  return res.send("i am a cheese");
}); //cheese test :D

app.get("/api/add-kitty", (req, res, next) => {
  const kitty = new Cat({ name: "Bruno" });
  kitty.save().then(() => console.log("nyahh nyah"));
  res.send(kitty);
});

app.get("/api/get-cats", async (req, res) => {
  try {
    let cats = await Cat.find();
    res.send(cats);
  } catch {
    res.send({ error: error.message });
  }
});

//requires authToken (protected endpoints)
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// Error handlers
app.use(error404);
app.use(error500);

const runServer = (port = PORT) => {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on("error", err => {
      console.error("Express failed to start");
      console.error(err);
    });
};

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app, runServer };

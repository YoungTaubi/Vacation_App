// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// Includes the build folder for deploymnet part 1
const path = require('path');
app.use(express.static(path.join(__dirname, "/client/build")));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const { isAuthenticated } = require('./middleware/jwt')

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const notification = require("./routes/notification");
app.use("/api/notification", isAuthenticated, notification);

const trips = require("./routes/trips");
app.use("/api/trips", isAuthenticated, trips);

const expences = require("./routes/expences");
app.use("/api/expences", isAuthenticated, expences);

const account = require("./routes/account");
app.use("/api/account", isAuthenticated, account);

const auth = require("./routes/auth");
app.use("/api/auth", auth);

// Includes the build folder for deploymnet part 2
app.use((req, res) => {
    // If no routes match, send them the React HTML.
    res.sendFile(__dirname + "/client/build/index.html");
  });

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;


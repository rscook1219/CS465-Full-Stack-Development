require('dotenv').config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("hbs");
const passport = require('passport');

// Bring in the database
require("./app_api/models/db");
require("./app_api/config/passport");

const indexRouter = require("./app_server/routes/index");
const usersRouter = require("./app_server/routes/users");
const travelRouter = require("./app_server/routes/travel");
const apiRouter = require("./app_api/routes/index");


var app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// View engine setup
app.set("views", path.join(__dirname, "app_server", "views"));

// Register handlebars partials
handlebars.registerPartials(__dirname + "/app_server/views/partials");

app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

// Wire-up routes to controllers
app.use("/api", apiRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/travel", travelRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

//catch unauthorized error and create 401
app.use((err, req, res, next) => {
    if (err.name == 'UnauthorizedError') {
        res
            .status(401)
            .json({"message": err.name + ": " + err.message});
    }
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;

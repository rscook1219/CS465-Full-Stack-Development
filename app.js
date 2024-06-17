var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./app_server/routes/index");
var usersRouter = require("./app_server/routes/users");
var travelRouter = require("./app_server/routes/travel");
var apiRouter = require("./app_api/routes/index");

const handlebars = require("hbs");

// Bring in the database
require("./app_api/models/db");

var app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
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

// Wire-up routes to controllers
app.use("/api", apiRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/travel", travelRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
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

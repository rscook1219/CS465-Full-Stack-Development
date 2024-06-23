const express = require("express"); // express app
const router = express.Router(); // router logic

const jwt = require('express-jwt');
const auth = jwt({
    secret: process.send.JWT_SECRET,
    userProperty: 'payload'
});

// this is where we import the controllers we will route
const authController = require('../controllers/authentication');
const tripsController = require("../controllers/trips");


// define route for our trips endpoint
router
    .route('/login')
    .post(authController.login);

router
    .route("/trips")
    .get(tripsController.tripsList) // GET Method routes tripList
    .post(auth, tripsController.tripsAddTrip); // POST method adds a trip

// GET method routes tripsFindByCode - requires parameter
// PUT method routes tripsUpdateTrip - requires parameter
router
    .route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode)
    .put(auth, tripsController.tripsUpdateTrip);

module.exports = router;

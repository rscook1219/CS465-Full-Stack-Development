const express = require("express"); // express app
const router = express.Router(); // router logic

// this is where we import the controllers we will route
const tripsController = require("../controllers/trips");

// define route for our trips endpoint
router
    .route("/trips")
    .get(tripsController.tripsList) // GET Method routes tripList
    .post(tripsController.tripsAddTrip); // POST method adds a trip

// GET method routes tripsFindByCode - requires parameter
// PUT method routes tripsUpdateTrip - requires parameter
router
    .route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode)
    .put(tripsController.tripsUpdateTrip);

module.exports = router;

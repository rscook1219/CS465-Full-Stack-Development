// app_api/controllers/trips.js

const fs = require("fs");
const path = require("path");
const Trip = require("../models/travlr");

const tripsFilePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "data",
    "trips.json"
);

const tripsList = (req, res) => {
    fs.readFile(tripsFilePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Could not read file" });
        } else {
            const trips = JSON.parse(data);
            res.status(200).json(trips);
        }
    });
};

const tripsFindByCode = (req, res) => {
    const tripCode = req.params.tripCode;
    fs.readFile(tripsFilePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Could not read file" });
        } else {
            const trips = JSON.parse(data);
            const trip = trips.find((t) => t.code === tripCode);
            if (trip) {
                res.status(200).json(trip);
            } else {
                res.status(404).json({ message: "Trip not found" });
            }
        }
    });
};

// POST: /trips - adds a new trip
// Regardless of outcome, response must include HTML status code and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
    });

    try {
        const q = await newTrip.save();

        if (!q) {
            // Database returned no data
            return res.status(400).json({ error: "Trip could not be added" });
        } else {
            // Return new trip
            return res.status(201).json(q);
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// PUT: /trips/:tripCode - Updates a trip
// Regardless of outcome, response must include HTML status code and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    // Uncomment for debugging
    // console.log(req.params);
    // console.log(req.body);

    try {
        const q = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description,
            },
            { new: true }
        ).exec();

        if (!q) {
            // Database returned no data
            return res.status(400).json({ error: "Trip not found" });
        } else {
            // Return resulting updated trip
            return res.status(201).json(q);
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    // Uncomment the following line to show results of operation on the console
    // console.log(q);
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
};
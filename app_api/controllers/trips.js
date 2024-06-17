const fs = require("fs");
const path = require("path");
const Trip = require("../models/travlr");

// Fetch all trips from the database
const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find();
        console.log("Fetched trips from database: ", trips);
        res.status(200).json(trips);
    } catch (err) {
        console.error("Error fetching trips: ", err);
        res.status(500).json({ error: err.message });
    }
};

// Fetch a trip by its code from the database
const tripsFindByCode = async (req, res) => {
    const tripCode = req.params.tripCode;
    try {
        const trip = await Trip.findOne({ code: tripCode });
        if (trip) {
            res.status(200).json(trip);
        } else {
            res.status(404).json({ message: "Trip not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new trip to the database
const tripsAddTrip = async (req, res) => {
    console.log("Received data for new trip:", req.body);

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
        const savedTrip = await newTrip.save();
        console.log("Saved trip to database:", savedTrip);
        return res.status(201).json(savedTrip);
    } catch (err) {
        console.error("Error saving trip:", err);
        return res.status(500).json({ error: err.message });
    }
};

// Update a trip in the database
const tripsUpdateTrip = async (req, res) => {
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

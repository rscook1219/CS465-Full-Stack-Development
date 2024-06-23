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
    getUser(req, res,
    (req, res) => {
        Trip
        .create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        },
        (err, trip) => {
            if (err) {
                return res
                    .status(400) // bad request
                    .json(err);
            } 
            else {
                return res
                    .status(201) // created
                    .json(trip);
            }
        });
    }
);
}

// Update a trip in the database
const tripsUpdateTrip = async (req, res) => {
    getUser(req, res, (req, res) => {
        Trip
            .findOneAndUpdate({'code': req.params.tripCode },{
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            }, { new: true })
            .then(trip => {
                if (!trip) {
                    return res
                    .status(404)
                    .send({
                        message: "Trip not found with code" + req.params.tripCode
                    });
                }
                res.send(trip);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res
                    .status(404)
                    .send({
                        message: "Trip not found with code" + req.params.tripCode
                    });
                }
                return res
                    .status(500) // server error
                    .json(err);
                });
            }
        );
    }

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
};

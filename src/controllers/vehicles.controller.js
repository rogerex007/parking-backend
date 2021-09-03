const vehicleCtr = {};
const Vehicles = require('../models/Vehicles');

vehicleCtr.create = async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Content can not be empy"
        });
    }

    Vehicles.findBylicensePlate(req.body.licensePlate, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                console.log(`Not found Vehicle with license plate ${req.body.licensePlate}.`);
                const vehicle = new Vehicles({
                    ownerName: req.body.ownerName,
                    licensePlate: req.body.licensePlate,
                });


                Vehicles.create(vehicle, (err, data) => {
                    if (err) {
                        res.status(500).json({
                            message:
                                err.message || "Some error occurred while creating the vehicle."
                        });
                    } else {
                        res.status(200).json({
                            message: 'Vehicle inserted in the database',
                            data
                        });
                    }
                });

            } else {
                console.log("Error retrieving Vehicle with license plate " + req.body.licensePlate);
            }
        } else {
            console.log("Exist!!");
            res.json({
                message: "License plate is taken",
            })
            return;
        }
    });







};

vehicleCtr.getAll = async (req, res) => {
    Vehicles.getAll((err, data) => {
        if (err) {
            res.status(500).json({
                message:
                    err.message || "Some error ocurred while retrieving vehicles"
            });
        } else {
            res.status(200).json(data);
        }
    });
};



module.exports = vehicleCtr;
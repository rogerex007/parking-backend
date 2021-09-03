const Registers = require("../models/Registers");
const moment = require('moment');
const registersCtr = {};


registersCtr.create = async (req, res) => {
    const { vehicleId } = req.body;
    if (!req.body) {
        res.status(400).json({
            message: "Content can not be empy"
        });
    }

    const register = new Registers({
        vehicleId: vehicleId,
        entryTime: moment().format(),
        outTime: '',
        totalTime: 0.0,
        status: true,
        totalToPay: 0.0
    });
    let count;
    Registers.countVehicles((err, data) => {
        if (err) {
            console.log(err.message || "Some error ocurred while retrieving vehicles");
        }else{
            console.log("COUNT: " + data[0].cant);
            count = data[0].cant;
        }
    })

    Registers.create(register, (err, data) => {
        if (err) {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while creating the register."
            });
        } else {
            if(count > 30){
                res.status(200).json({
                    message : 'Parking is full'
                });
                return;
            }
            res.status(200).json({
                message: 'Register inserted in the database',
                data
            });
        }
    })
};

registersCtr.getAll = async (req, res) => {
    Registers.getAll((err, data) => {
        if (err) {
            res.status(500).json({
                message:
                    err.message || "Some error ocurred while retrieving vehicles"
            });
        } else {
            res.status(200).json(data);
        }
    })
};

registersCtr.update = async (req, res) => {
    const {vehicleId} = req.params;
   
    Registers.findByVehicleId(vehicleId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                console.log(`Not found Vehicle with license plate ${req.body.vehicleId}.`);


            } else {
                console.log("Error retrieving Vehicle with license plate " + req.body.vehicleId);
            }
        } else {
            console.log("Exist!!");
            
            console.log("DATA: " + data.entryTime);
            let outTime = moment().format();
            let fecha1 = moment(data.entryTime);
            let fecha2 = moment(outTime);

            let totalTime = fecha2.diff(fecha1, 'minute');
            console.log("DIFF: " + fecha2.diff(fecha1, 'minute') + " minutos" );
            console.log("TOTAL TO PAY: $" + 100 * totalTime );
            let totalToPay = 100 * totalTime;

            let register = new Registers({
                outTime : outTime,
                totalTime : totalTime,
                status : false,
                totalToPay : totalToPay
            });

            Registers.updateByVehicleId(vehicleId, register, (err, data) => {
                if (err) {
                    if (err.kind == "not_found") {
                        res.status(404).json({
                            message: `Not found register with vehicle ID: ${vehicleId}.`
                        });
                    }else{
                        res.status(500).json({
                            message: `Error updating register with vehicle ID: ${vehicleId}.`
                        });
                    }
                }else{
                    res.status(200).json(data);
                }
            });
        };
    });

    
}


module.exports = registersCtr;
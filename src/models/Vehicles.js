const sql = require('../database/connection');

const Vehicles = function(vehicle){
    this.ownerName = vehicle.ownerName;
    this.licensePlate = vehicle.licensePlate; 
    

};

Vehicles.create = (newVehicle, result) => {
    sql.query("INSERT INTO vehicles SET ?", newVehicle, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created vehicle: ", { id: res.insertId, ...newVehicle });
        result(null, { id: res.insertId, ...newVehicle });
    });
};

Vehicles.getAll = (result) => {
    sql.query("SELECT * FROM vehicles", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("vehicles: ", res);
        result(null, res);
    });
};

Vehicles.findBylicensePlate = (licensePlate, result) => {
    sql.query(`SELECT * FROM vehicles WHERE licensePlate = '${licensePlate}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found vehicle: ", res[0]);
            result(null, res[0]);
            return;
        }

        // Not found Vehicle with the id
        result({ kind: "not_found" }, null);
    });
};

Vehicles.updateById = (id, vehicle, result) => {
    sql.query(
        "UPDATE vehicles SET placa = ?, ownerName = ?,  WHERE id = ?",
        [vehicle.placa, vehicle.ownerName, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // Not found Vehicle with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated Vehicle: ", { id: id, ...vehicle });
            result(null, { id: id, ...vehicle });
        }
    );
};

module.exports = Vehicles;
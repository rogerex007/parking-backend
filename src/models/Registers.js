const sql = require('../database/connection');

const Registers = function (register) {
    this.vehicleId = register.vehicleId;
    this.entryTime = register.entryTime;
    this.outTime = register.outTime;
    this.totalTime = register.totalTime;
    this.status = register.status;
    this.totalToPay = register.totalToPay;
}

Registers.create = (newRegister, result) => {
    sql.query("INSERT INTO registers SET ?", newRegister, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created register: ", { id: res.insertId, ...newRegister });
        result(null, { id: res.insertId, ...newRegister });
    });
};

Registers.getAll = (result) => {
    sql.query("SELECT v.ownerName, v.licensePlate, r.entryTime, r.outTime, r.totalTime, r.status, r.totalToPay FROM registers r INNER JOIN vehicles v ON r.vehicleId = v.id", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("registers: ", res);
        result(null, res);
    });
};

Registers.findByVehicleId = (id, result) => {
    sql.query(`SELECT * FROM registers WHERE vehicleId = '${id}' AND status = 1`, (err, res) => {
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

Registers.updateByVehicleId = (id, register, result) => {
    sql.query(
        "UPDATE registers SET outTime = ?, totalTime = ?, status = ?, totalToPay = ? WHERE vehicleId = ?",
        [register.outTime, register.totalTime, register.status, register.totalToPay, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // Not found register to the vehicle ID
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated register: ", { id: id, ...register });
            result(null, { id: id, ...register });

        }
    );
};

Registers.countVehicles = (result) => {
    sql.query("SELECT count(*) AS cant FROM registers WHERE status = 1", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("count: ", res);
        result(null, res);
    })
}

module.exports = Registers;
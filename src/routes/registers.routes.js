const express = require('express');
const registersCtr = require('../controllers/registers.controller');


const router = express.Router();

router.post('/create', registersCtr.create);
router.get('/', registersCtr.getAll);
router.put('/update/:vehicleId', registersCtr.update);

module.exports = router;
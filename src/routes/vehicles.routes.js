const express = require('express');
const vehicleCtr = require('../controllers/vehicles.controller');

const router = express.Router();

router.post('/create', vehicleCtr.create);
router.get('/', vehicleCtr.getAll);

module.exports = router;
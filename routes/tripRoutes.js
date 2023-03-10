const express = require("express");
const tripController = require("../controllers/tripController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post('/getTrips', [ check('depart').notEmpty().withMessage('Depart is Empty.'),
                           check('destination').notEmpty().withMessage('Destination is Empty.'),
                           check('depart_date').notEmpty().withMessage('Depart_Date is Empty.'),
                        ], tripController.getTrips)
                        
router.post('/getRoutes', tripController.getRoutes)
module.exports = router;    
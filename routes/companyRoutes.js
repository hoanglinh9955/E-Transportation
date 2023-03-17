const express = require("express");
const companyController = require("../controllers/companyController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post('/getRoutesByComId', companyController.getRouteByComId);

router.post('/getTripsByComId', companyController.getTripsByComId);

router.post('/createUpdateTripByCompany', companyController.createUpdateTripByCompany);

router.post('/createUpdateRouteByComId',companyController.createUpdateRouteByComId);

router.post('/deleteRouteByRouteIdAndComId', companyController.deleteRouteByRouteIdAndComId);

//,[  check('depart').notEmpty().withMessage('Depart is Empty.'),
//check('destination').notEmpty().withMessage('Destination is Empty.'),
//],

router.post('/getRoutesNameByComId', companyController.getRouteNameByComId);

router.post('/getOutComeByComId', companyController.getOutComeByComId);

module.exports = router;
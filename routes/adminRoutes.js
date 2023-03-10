const express = require("express");
const adminController = require("../controllers/adminController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post('/createCompany',   [check("email").isEmail().withMessage('Invalid Email'),
                                 check('password').isLength({ min: 6 }).withMessage('Invalid Password'),
                                 check('name').notEmpty().withMessage('Name Company Is Empty'),
                                 check('address').notEmpty().withMessage('Address Company Is Empty'),
                                 check('hotline').isLength({ min: 6 }).withMessage('Hotline is less than 6 number')
                                                ] ,adminController.createCompany);

router.post('/getAllCompany', adminController.getAllCompany);

router.post('/getAllUser', adminController.getAllUser);

router.post('/banCompanyByEmail', check("email").isEmail().withMessage('Invalid Email'), adminController.banCompanybyEmail);

router.post('/unBanCompanyByEmail', check("email").isEmail().withMessage('Invalid Email'), adminController.unBanCompanybyEmail);

router.post('/banUserByEmail', check("email").isEmail().withMessage('Invalid Email'), adminController.banUserbyEmail);

router.post('/unBanUserByEmail', check("email").isEmail().withMessage('Invalid Email'), adminController.unBanUserbyEmail);

router.post('/updateCompany', [check("email").isEmail().withMessage('Invalid Email'),
                                check('status').notEmpty().withMessage('Invalid Status'),
                                check('name').notEmpty().withMessage('Name Company Is Empty'),
                                check('address').notEmpty().withMessage('Address Company Is Empty'),
                                check('hotline').isLength({ min: 6 }).withMessage('Hotline is less than 6 number')
                                                ] , adminController.updateCompany);

module.exports = router;
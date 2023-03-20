const express = require("express");
const adminController = require("../controllers/adminController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.post('/createCompany',   [check("email").isEmail().withMessage('Email Không Hợp Lệ'),
                                 check('password').isLength({ min: 6 }).withMessage('Mật Khẩu Không Hợp Lệ, Xin Nhập Mật Khẩu Lớn Hơn 6 Số.'),
                                 check('name').notEmpty().withMessage('Tên Công Ty Không Được Để Trống'),
                                 check('address').notEmpty().withMessage('Địa Chỉ Công Ty Không Được Để Trống'),
                                 check('hotline').isLength({ min: 6 }).withMessage('HotLine Không Hợp Lệ, Xin Nhập Số Điện Thoại Lớn Hơn 6 Số.')
                                                ] ,adminController.createCompany);

router.post('/getAllCompany', adminController.getAllCompany);

router.post('/getAllUser', adminController.getAllUser);

router.post('/banCompanyByEmail', check("email").isEmail().withMessage('Email'), adminController.banCompanybyEmail);

router.post('/unBanCompanyByEmail', check("email").isEmail().withMessage('Email Không Hợp Lệ'), adminController.unBanCompanybyEmail);

router.post('/banUserByEmail', check("email").isEmail().withMessage('Email Không Hợp Lệ'), adminController.banUserbyEmail);

router.post('/unBanUserByEmail', check("email").isEmail().withMessage('Email Không Hợp Lệ'), adminController.unBanUserbyEmail);

router.post('/updateCompany', [check("email").isEmail().withMessage('Email Không Hợp Lệ'),
                                check('status').notEmpty().withMessage('Status Không Hợp Lệ'),
                                check('name').notEmpty().withMessage('Tên Công Ty Không Được Để Trống'),
                                check('address').notEmpty().withMessage('Địa Chỉ Công Ty Không Được Để Trống.'),
                                check('hotline').isLength({ min: 6 }).withMessage('HotLine Không Hợp Lệ, Xin Nhập Số Điện Thoại Lớn Hơn 6 Số.')
                                                ] , adminController.updateCompany);

module.exports = router;
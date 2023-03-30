const express = require("express");
const userController = require("../controllers/userController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

//Route to handle user registration
router.post("/register", 
             [check("email").isEmail().withMessage('Email Không Hợp Lệ.'),
              check('password').isLength({ min: 6 }).withMessage('Mật Khẩu Không Hợp Lệ, Xin Nhập Mật Khẩu Lớn Hơn 6 Số.'),
              check('phone_number').isLength({ min: 6 }).withMessage('Số Điện Thoại Không Hợp Lệ, Xin Nhập Số Điện Thoại Lớn Hơn 6 Số.'),
              check('name').notEmpty().withMessage('Họ Và Tên Không Được Để Trống')
            ]
, userController.register);
  
//Route to handle user login
router.post("/login", 
             [check("email").isEmail().withMessage('Email Không Hợp Lệ'),
              check('password').isLength({ min: 6 }).withMessage('Mật Khẩu Không Hợp Lệ')
            ],
 userController.login);

router.post('/user/orderTicket', userController.createOrder);

router.post('/user/getCell', userController.getCellByTranId);

router.post('/user/getTicketByUserId', userController.getTicketByUserId);

router.post('/user/cancelTicket', userController.cancelTicket);

router.post('/user/forgetPassword', userController.forgetPassword);

router.post('/user/resetPassword', userController.resetPassword);

router.post('/user/updatePhoneNumber', userController.updatePhoneNumber);


module.exports = router;

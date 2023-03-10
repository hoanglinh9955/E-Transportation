const express = require("express");
const userController = require("../controllers/userController");
const { check, validationResult } = require("express-validator");

const router = express.Router();

//Route to handle user registration
router.post("/register", 
             [check("email").isEmail().withMessage('Invalid Email'),
              check('password').isLength({ min: 6 }).withMessage('Invalid Password'),
              check('phone_number').isLength({ min: 6 }).withMessage('Phone Number Less Than 6'),
              check('name').notEmpty().withMessage('User Name is Empty')
            ]
, userController.register);
  
//Route to handle user login
router.post("/login", 
             [check("email").isEmail().withMessage('Invalid Email'),
              check('password').isLength({ min: 6 }).withMessage('Invalid Password')
            ],
 userController.login);

router.post('/user/orderTicket', userController.createOrder);

router.post('/user/getCell', userController.getCellByTranId);

module.exports = router;

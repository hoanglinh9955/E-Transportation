const  User = require('../models/user');
const Ticket = require('../models/ticket');
const Company = require('../models/company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const sendgrid = require('@sendgrid/mail');

const API_KEY = "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";

sendgrid.setApiKey(API_KEY);

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return;
  }
  const { name, email, password, phone_number } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log("this is err")
      return res.status(200).json({
        message: 'some thing went wrong, invalid input',
        data: false
      })
    }
    // hash is a password hash change hash
    // turn off hash function 
    //const user = new User(name, email, hash, phone_number, "USER", 1);
    const user = new User(name, email, password, phone_number, "USER", 1);

    const result = await user.findOne(email)
      .then(result => { return result })
      .catch(err => console.log(err))
    //find mail in company email
    const com = new Company();
    const findCom = await com.findOne(email)
      .then(result => { return result })
      .catch(err => console.log(err))
    console.log('company test')
    if(findCom.recordset.length > 0){
        res.status(200).json({
          message: 'User with that email is Company email. Please use another email',
          data: false
        });
        return
    }
    
    if (result.recordset.length > 0) {
      res.status(200).json({
        message: 'User with that email exist. Please use another email',
        data: false
      });
      return
    } 
    else {
      const rs = await user.save()
        .then(result => { return result })
        .catch(err => console.log(err))

      if (!rs) {
        return res.status(200).json({
          message: "Insert To Database False",
          data: false
        })
      }
     
      if (rs) {
        //get userid created
        let findUser = await user.findOne(email)
          .then(result => { return result })
          .catch(err => console.log(err))
        //return res success to client
          return res.status(200).json({
            message: "Create User Success",
            data: true,
            userId: findUser.recordset[0].id
        })
      }
    }
  });
}

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return;
  }
  
  const { email, password } = req.body;
  const user = new User();
  const company = new Company();
  //find user email
  const findUser = await user.findOne(email)
    .then(result => { return result })
    .catch(err => console.log(err))
  // find company email
    const findCom = await company.findOne(email)
    .then(result => { return result })
    .catch(err => console.log(err))

  if (!(findUser.recordset.length > 0|| findCom.recordset.length > 0)) {
    res.status(200).json({
      message: 'Email does not exist. Please signup',
      data: false
    });
    return;
  }
  
  loadedUser = findUser.recordset[0];
  loadedCom = findCom.recordset[0]
  try {
    if(loadedUser === undefined){
      console.log(loadedCom)
      // User email is undefiled
      // company is correct
      try {
        if(!(password === loadedCom.password)){
          const error = new Error('Sai Mật Khẩu ');
              error.statusCode = 200;
              error.data = false;
              throw error;
    
        } 
        console.log(loadedCom)
        if(loadedCom){
          const token = jwt.sign(
            {
              email: loadedCom.email,
              companyId: loadedCom.id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );
      
          res.status(200).json({
            message: 'Login successed',
            data: true,
            token: token,
            companyId: loadedCom.id.toString(),
            role: loadedCom.role,
            status: loadedCom.status
          });
          return;
        
        }     
      } catch (err) {
        if(!err.statusCode){
          err.statusCode = 200;
        }
        next(err)
      }
    }
   if(loadedCom === undefined){
    console.log(loadedUser);
      // company email is undefiled
      // user is correct
      try {
        if(!(password === loadedUser.password)){
          const error = new Error('Wrong password!');
              error.statusCode = 200;
              error.data = false;
              throw error;
    
        }
        if(loadedUser){
          const token = jwt.sign(
            {
              email: loadedUser.email,
              userId: loadedUser.id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );
      
          res.status(200).json({
            message: 'Login successed',
            data: true,
            token: token,
            userId: loadedUser.id.toString(),
            role: loadedUser.role,
            status: loadedUser.status,
            user_name: loadedUser.name
          });
          return;
        
        }     
      } catch (err) {
        if(!err.statusCode){
          err.statusCode = 200;
        }
        next(err)
      }
    }
  } catch (error) {
    console.log('Err: ', error)
  }
  
  
  
  // return bcrypt.compare(password, loadedUser.password)
  //   .then(isEqual => {
  //     if (!isEqual) {
  //       const error = new Error('Wrong password!');
  //       error.statusCode = 400;
  //       error.data = false;
  //       throw error;
  //     }
  //     const token = jwt.sign(
  //       {
  //         email: loadedUser.email,
  //         userId: loadedUser.id.toString()
  //       },
  //       'somesupersecretsecret',
  //       { expiresIn: '1h' }
  //     );

  //     res.status(200).json({
  //       message: 'Login successed',
  //       data: true,
  //       token: token,
  //       userId: loadedUser.id.toString(),
  //       role: loadedUser.role
  //     });
  //     return;
  //   })
  //   .catch(err => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   });
}


exports.createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return;
  }
  const {transport_id, user_id, quantity, array_sit_number} = req.body;
  const ticket = new Ticket();
  const result = await ticket.orderTicket(transport_id, user_id, quantity, array_sit_number)
    .then(result => { return result })
    .catch(err => console.log(err))

  if(result === 'sitting_is_full'){
    res.status(200).json({
      message: "Please Order Another Trip, Ticket Of This Trip Is Sold Out !!!",
      data: false
    })
    return
  }
    
  console.log(result)
  if (result === undefined) {
    res.status(200).json({
      message: "Order Ticket False",
      data: false
    })
    return
  }

  if (result) {
    res.status(200).json({
      message: 'Order Ticket Success',
      data: true,
      ticket_id: result.recordset[0].ticket_id
    })
    return
  }

}


exports.getCellByTranId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid Input');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return;
  }
  const {transport_id, type} = req.body;
  const ticket = new Ticket();
  const result = await ticket.getCellByTranId(transport_id)
    .then(result => { return result })
    .catch(err => console.log(err))

    
  console.log(result)
  if (result === undefined) {
    res.status(200).json({
      message: "Don't Have Sit Been Ordered !!!",
      data: false
    })
    return
  }

  if (result) {
    class cell {
      constructor(sit_number, boolean) {
        this.sit_number = sit_number;
        this.boolean = boolean;
      }
    }

    const array = result.recordset;
    const array_result = [];
    for (i = 0; i < type; i++){
      check = false;
      array.map(e => {
        if(e.sit_number === i+1){
          array_result.push(new cell(i+1, true))
          check = true
        }
      })
        if(check === false){
          array_result.push(new cell(i+1, false))
      }
    }
    console.log(array)
    res.status(200).json({
      message: 'Get Cell Success',
      data: true,
      result: array_result
    })
    return
  }
  
}


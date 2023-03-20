const Company = require('../models/company');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

exports.createCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Lỗi.');
      error.statusCode = 200;
      error.message = errors.errors;
      error.data = false;
      next(error);
      return;
    }
    const { name, email, password, address, hotline } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(200).json({
          message: 'Lỗi. Xin Hãy Nhập Lại',
          data: false
        })
      }
      // hash is a password hash change hash
      //turn off hash password function
      //const user = new User(name, email, hash, "COMPANY", 1, address, hotline);
      const company = new Company(name, email, password, "COMPANY" , 1, address, hotline);
      //find and check is user exist

      const result = await company.findOne(email)
        .then(result => { return result })
        .catch(err => console.log(err))
  //find mail in User email
  const user = new User();
  const findUser = await user.findOne(email)
    .then(result => { return result })
    .catch(err => console.log(err))

  if(findUser.recordset.length > 0){
      res.status(200).json({
        message: 'Email Này Là Email Của Người Dùng, Xin Hãy Đăng Ký Một Email Khác.',
        data: false
      });
      return
  }
      
      if (result.recordset[0]) {
        res.status(200).json({
          message: 'Email Công Ty Này Đã Tồn Tại, Xin Hãy Đăng Ký Một Email Khác.',
          data: false
        });
        return
      } else {
        const rs = await company.save()
          .then(result => { return result })
          .catch(err => console.log(err))
  
        if (!rs) {
          return res.status(200).json({
            message: "Đăng Ký Công Ty Thất Bại",
            data: false
          })
        }
        // result save success find user id in database and return to client
        if (rs) {
            let findCompany = await company.findOne(email)
            .then(result => { return result })
            .catch(err => console.log(err))
          //return res success to client
            return res.status(200).json({
              message: "Đăng Ký Công Ty Thành Công",
              data: true,
              companyId: findCompany.recordset[0].id
          })
        }
      }
    });
  }

  exports.getAllCompany = async (req, res, next) => {
    const company = new Company();

  const result = await company.getAllCompany()
    .then(result => { return result })
    .catch(err => console.log(err))

  console.log(result)
  if (result.recordset.length == 0) {
    res.status(200).json({
      message: "Không Có Công Ty Nào Để Hiển Thị",
      data: false
    })
    return
  }

  if (result.recordset) {
    res.status(200).json({
      message: 'Hiển Thị Tất Cả Thông Tin Công Ty Thành Công.',
      data: true,
      result: result.recordset
    })
    return
  }
}

exports.getAllUser = async (req, res, next) => {
  const user = new User();

const result = await user.getAllUser()
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)
if (result.recordset.length == 0) {
  res.status(200).json({
    message: "Không Có Người Dùng Nào Để Hiển Thị.",
    data: false
  })
  return
}

if (result.recordset) {
  res.status(200).json({
    message: 'Hiển Thị Tất Cả Các Người Dùng.',
    data: true,
    result: result.recordset
  })
  return
}}


exports.banCompanybyEmail = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.errors)
    if (!errors.isEmpty()) {
      const error = new Error('Lỗi');
      error.statusCode = 200;
      error.data = false;
      error.message = errors.errors
      next(error);
      return;
    }
  const company = new Company();
  const email = req.body.email

  const findCom = await company.findOne(email)
  .then(result => { return result })
  .catch(err => console.log(err))

  if(findCom.rowsAffected[0] == 0){
    return res.status(200).json({
      message: "Email Này Không Tồn Tại.",
      data: false
  })
}
  const result = await company.banCompanyByEmail(email)
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)
if (result.rowsAffected == 0) {
  res.status(200).json({
    message: "Khóa Tài Khoản Công Ty Thất Bại.",
    data: false
  })
  return
}

if (result.rowsAffected > 0) {
  res.status(200).json({
    message: 'Khóa Tài Khoản Công Ty Thành Công.',
    data: true,
  })
  return
}}


exports.unBanCompanybyEmail = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.errors)
    if (!errors.isEmpty()) {
      const error = new Error('Lỗi');
      error.statusCode = 200;
      error.data = false;
      error.message = errors.errors
      next(error);
      return;
    }
  const company = new Company();
  const email = req.body.email

  const findCom = await company.findOne(email)
  .then(result => { return result })
  .catch(err => console.log(err))

  if(findCom.rowsAffected[0] == 0){
    return res.status(200).json({
      message: "Email Này Không Tồn Tại.",
      data: false
  })
}
  const result = await company.unBanCompanyByEmail(email)
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)
if (result.rowsAffected == 0) {
  res.status(200).json({
    message: "Mở Khóa Tài Khoản Công Ty Thất Bại.",
    data: false
  })
  return
}

if (result.rowsAffected > 0) {
  res.status(200).json({
    message: 'Mở Khóa Tài Khoản Công Ty Thành Công.',
    data: true,
  })
  return
}}


exports.banUserbyEmail = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.errors)
    if (!errors.isEmpty()) {
      const error = new Error('Lỗi');
      error.statusCode = 200;
      error.data = false;
      error.message = errors.errors
      next(error);
      return;
    }
  const user = new User();
  const email = req.body.email

  const findUser = await user.findOne(email)
  .then(result => { return result })
  .catch(err => console.log(err))

  if(findUser.rowsAffected[0] == 0){
    return res.status(200).json({
      message: "Email Này Không Tồn Tại.",
      data: false
  })
}
  const result = await user.banUserByEmail(email)
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)
if (result.rowsAffected == 0) {
  res.status(200).json({
    message: "Khóa Tài Khoản Người Dùng Thất Bại",
    data: false
  })
  return
}

if (result.rowsAffected > 0) {
  res.status(200).json({
    message: 'Khóa Tài Khoản Người Dùng Thành Công',
    data: true,
  })
  return
}}


exports.unBanUserbyEmail = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.errors)
    if (!errors.isEmpty()) {
      const error = new Error('Lỗi.');
      error.statusCode = 200;
      error.data = false;
      error.message = errors.errors
      next(error);
      return;
    }
  const user = new User();
  const email = req.body.email

  const findUser = await user.findOne(email)
  .then(result => { return result })
  .catch(err => console.log(err))

  if(findUser.rowsAffected[0] == 0){
    return res.status(200).json({
      message: "Email Này Không Tồn Tại.",
      data: false
  })
}
  const result = await user.unBanUserByEmail(email)
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)
if (result.rowsAffected == 0) {
  res.status(200).json({
    message: "Mở Khóa Tài Khoản Người Dùng Thất Bại.",
    data: false
  })
  return
}

if (result.rowsAffected > 0) {
  res.status(200).json({
    message: 'Mở Khóa Tài Khoản Người Dùng Thành Công.',
    data: true,
  })
  return
}}


exports.updateCompany = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.errors)
    if (!errors.isEmpty()) {
      const error = new Error('Lỗi');
      error.statusCode = 200;
      error.data = false;
      error.message = errors.errors
      next(error);
      return;
    }
  const company = new Company();
  const {email, name, hotline, address, status} = req.body

  const findCom = await company.findOne(email)
  .then(result => { return result })
  .catch(err => console.log(err))

  if(findCom.rowsAffected[0] == 0){
    return res.status(200).json({
      message: "Email Này Không Tồn Tại.",
      data: false
  })
}
  const result = await company.updateCompany(name, email, hotline, address, status)
  .then(result => { return result })
  .catch(err => console.log(err))

console.log(result)
if (result.rowsAffected == 0) {
  res.status(200).json({
    message: "Cập Nhật Công Ty Thất Bại.",
    data: false
  })
  return
}

if (result.rowsAffected > 0) {
  res.status(200).json({
    message: 'Cập Nhật Công Ty Thành Công.',
    data: true,
  })
  return
}}
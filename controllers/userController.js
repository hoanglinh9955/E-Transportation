const User = require('../models/user');
const Ticket = require('../models/ticket');
const Company = require('../models/company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/nodemailer')
const { validationResult, check } = require('express-validator/check');





exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.errors)
    const error = new Error('Lỗi');
    error.statusCode = 200;
    error.message = errors.errors[0].msg;
    error.data = false;
    next(error);
    return;
  }
  const { name, email, password, phone_number } = req.body;
  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      console.log("this is err")
      return res.status(200).json({
        message: 'Lỗi, Xin Lỗi Bạn Vì Sự Bất Tiện Này.',
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
    if (findCom.recordset.length > 0) {
      res.status(200).json({
        message: 'Email Này Là Email Công Ty, Xin Hãy Đăng Ký Bằng Một Email Khác.',
        data: false
      });
      return
    }

    if (result.recordset.length > 0) {
      res.status(200).json({
        message: 'Email Này Tồn Tại, Xin Hãy Đăng Ký Bằng Một Email Khác.',
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
          message: "Thêm Tài Khoản Vào Cơ Sở Dữ Liệu Thất Bại.",
          data: false
        })
      }

      if (rs) {
        //get userid created
        let findUser = await user.findOne(email)
          .then(result => { return result })
          .catch(err => console.log(err))
        //return res success to client
        // setup email data
        let mailOptions = {
          from: '<e.transportation.saleticket@gmail.com>',
          subject: 'Đăng Ký Tài Khoản Thành Công',
          to: email,
          html: `<h1>${name} Đã Đăng Ký Tài Khoản Thành Công</h1>
                  <h3> Đây Là Email Xác Nhận, Không Cần Phản Hồi <h3/>
                  <h3> Nếu Bạn Cần Hỗ Trợ <h3/>
                  <h3> HotLine: 1999 0000 <h3/>
                  <h3> Email: e.transportation.saleticket@gmail.com <h3/>`,
          text: 'Bạn Đã Đăng Ký Tài Khoản Thành Công',
        };

        // send email with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Message sent: %s', info.messageId);
          }
        });

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
    const error = new Error('Lỗi');
    error.statusCode = 200;
    error.message = errors.errors[0].msg;
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



  if (!(findUser.recordset.length > 0 || findCom.recordset.length > 0)) {
    res.status(200).json({
      message: 'Email Không Tồn Tại, Hãy Đăng Ký Tài Mới',
      data: false
    });
    return;
  }

  loadedUser = findUser.recordset[0];
  loadedCom = findCom.recordset[0]
  try {
    if (loadedUser === undefined) {
      console.log(loadedCom)
      // User email is undefiled
      // company is correct
      try {
        if (!(password === loadedCom.password)) {
          const error = new Error();
          error.statusCode = 200;
          error.message = 'Sai Mật Khẩu '
          error.data = false;
          throw error

        }
        console.log(loadedCom)
        if (loadedCom) {
          const token = jwt.sign(
            {
              email: loadedCom.email,
              companyId: loadedCom.id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );

          res.status(200).json({
            message: 'Đăng Nhập Thành Công',
            data: true,
            token: token,
            companyId: loadedCom.id.toString(),
            role: loadedCom.role,
            status: loadedCom.status,
            companyName: loadedCom.name
          });
          return;

        }
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 200;
        }
        next(err)
      }
    }
    if (loadedCom === undefined) {
      console.log(loadedUser);
      // company email is undefiled
      // user is correct
      try {
        if (!(password === loadedUser.password)) {
          const error = new Error('Sai Mật Khẩu');
          error.statusCode = 200;
          error.message = 'Sai Mật Khẩu'
          error.data = false;
          throw error;

        }
        if (loadedUser) {
          const token = jwt.sign(
            {
              email: loadedUser.email,
              userId: loadedUser.id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );

          const ticket = new Ticket();
          userTicket = await ticket.getTicketByUserId(loadedUser.id)
            .then(result => { return result })
            .catch(err => console.log(err))

          res.status(200).json({
            message: 'Đăng Nhập Thành Công',
            data: true,
            token: token,
            userId: loadedUser.id.toString(),
            user_email: loadedUser.email,
            role: loadedUser.role,
            status: loadedUser.status,
            user_name: loadedUser.name,
            phone_number: loadedUser.phone_number,
            ticket: userTicket
          });
          return;

        }
      } catch (err) {
        if (!err.statusCode) {
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
    const error = new Error('Lỗi');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return;
  }
  const { transport_id, user_id, quantity, array_sit_number } = req.body;
  const ticket = new Ticket();


  const result = await ticket.orderTicket(transport_id, user_id, quantity, array_sit_number)
    .then(result => { return result })
    .catch(err => console.log(err))

  if (result === 'sitting_is_full') {
    res.status(200).json({
      message: "Chyến Xe Không Đủ Chỗ ngồi, Bạn Vui Lòng Chọn Chuyến xe Khác",
      data: false
    })
    return
  }

  console.log(result)
  if (result === undefined || result.length == 0) {
    res.status(200).json({
      message: "Đặt Vé Thất Bại",
      data: false
    })
    return
  }

  if (result) {

    // let mailOptions = {
    //   from: '<e.transportation.saleticket@gmail.com>',
    //   subject: 'Đăng Ký Tài Khoản Thành Công',
    //   to: email,
    //   html: `<h1>${name} Đã Đăng Ký Tài Khoản Thành Công</h1>
    //          <h3> Đây Là Email Xác Nhận, Không Cần Phản Hồi <h3/>
    //          <h3> Nếu Bạn Cần Hỗ Trợ <h3/>
    //          <h3> HotLine: 1999 0000 <h3/>
    //          <h3> Email: e.transportation.saleticket@gmail.com <h3/>`,
    //   text: 'Bạn Đã Đăng Ký Tài Khoản Thành Công',
    // };

    // // send email with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log('Message sent: %s', info.messageId);
    //   }
    // });

    res.status(200).json({
      message: 'Đặt Vé Thành Công',
      data: true,
      ticket_id: result
    })
    return
  }

}


exports.getCellByTranId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return;
  }
  const { transport_id, type } = req.body;
  const ticket = new Ticket();
  const result = await ticket.getCellByTranId(transport_id)
    .then(result => { return result })
    .catch(err => console.log(err))


  console.log(result)
  if (result === undefined) {
    res.status(200).json({
      message: "Không Có Chỗ Ngồi Nào Được Đặt",
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
    for (i = 0; i < type; i++) {
      var check = false;
      array.map(e => {
        if (e.sit_number === i + 1) {
          array_result.push(new cell(i + 1, true))
          check = true
        }
      })
      if (check === false) {
        array_result.push(new cell(i + 1, false))
      }
    }


    console.log(array)
    res.status(200).json({
      message: 'Lấy Chỗ Ngồi Thành Công',
      data: true,
      seats: array_result
    })
    return
  }

}


exports.getTicketByUserId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi');
    error.statusCode = 200;
    error.message = errors.errors;
    error.data = false;
    next(error);
    return;
  }
  const { user_id } = req.body;
  const ticket = new Ticket();
  const result = await ticket.getTicketByUserId(user_id)
    .then(result => { return result })
    .catch(err => console.log(err))


  console.log(result)
  if (result === undefined || result.length == 0) {
    res.status(200).json({
      message: "Bạn Không Có Vé Nào Đã Mua",
      data: false
    })
    return
  }

  res.status(200).json({
    message: 'Đặt Vé Thành Công',
    data: true,
    ticket: result
  })
  return
}

exports.cancelTicket = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi');
    error.statusCode = 200;
    error.message = errors.errors[0].msg;
    error.data = false;
    next(error);
  }
  const { user_id, ticket_id, sit_number } = req.body;
  const ticket = new Ticket();
  const result = await ticket.cancelTicket(ticket_id, user_id, sit_number)
    .then(result => { return result })
    .catch(err => console.log(err))
  if (result === 'cannotCancel') {
    res.status(200).json({
      message: "Xe Sắp Khởi Hành Trong 24 giờ Nữa, Vui Lòng Không Hủy Vé",
      data: false
    })
    return
  }

  console.log(result)
  if (result === undefined || result.rowsAffected == 0) {
    res.status(200).json({
      message: "Hủy Vé Thất Bại",
      data: false
    })
    return
  }
  if (result != 'cannotCancel' && result)
    res.status(200).json({
      message: 'Hủy Vé Thành Công',
      data: true,
    })
  return
}

exports.forgetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi');
    error.statusCode = 200;
    error.message = errors.errors[0].msg;
    error.data = false;
    next(error);
  }
  const { email } = req.body;
  const user = new User();
  const checkUser = await user.findOne(email)
    .then(result => { return result })
    .catch(err => console.log(err))

  if (checkUser === undefined || checkUser.recordset.length == 0) {

    res.status(200).json({
      message: "Email Này Không Tồn Tại, Xin Hãy Nhập Một Email Khác.",
      data: false
    })
    return
  }
  const randomPassword = Math.floor(Math.random() * 900000) + 100000;

  const result = await user.forgetPassword(email, randomPassword)
    .then(result => { return result })
    .catch(err => console.log(err))
  console.log(result)

  if (result === undefined || result.rowsAffected[0] <= 0) {
    res.status(200).json({
      message: "Gửi Mật Khẩu Cho Người Dùng Thất Bại",
      data: false
    })
    return
  }

  console.log(result)

  if (result.rowsAffected[0] > 0) {
    let mailOptions = {
      from: '<e.transportation.saleticket@gmail.com>',
      subject: 'Lấy Mật Khẩu Thành Công',
      to: email,
      html: `<h3> ${randomPassword} là Mật Khẩu Tạm Thời Của Bạn.</h3>
             <h3> Xin Hãy Đổi Mật Khẩu Để Bảo Mật Thông Tin <h3/>
             <h3> Nếu Bạn Cần Hỗ Trợ <h3/>
             <h3> HotLine: 1999 0000 <h3/>
             <h3> Email: e.transportation.saleticket@gmail.com <h3/>`,
      text: 'Lấy Mật Khẩu Thành Công',
    };

    // send email with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: %s', info.messageId);
      }
    });
    res.status(200).json({
      message: 'Gửi Mật Khẩu Đến Người Dùng Thành Công',
      data: true,
    })
    return
  }

}

exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Lỗi');
    error.statusCode = 200;
    error.message = errors.errors[0].msg;
    error.data = false;
    next(error);
  }
  const user = new User();
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(200).json({
      message: "Mật Khẩu Xác Nhận Không Trùng.",
      data: false
    })
    return
  }



  const result = await user.forgetPassword(email, confirmPassword)
    .then(result => { return result })
    .catch(err => console.log(err))
  console.log(result)

  if (result === undefined || result.rowsAffected[0] <= 0) {
    res.status(200).json({
      message: "Đổi Mật Khẩu Thất Bại.",
      data: false
    })
    return
  }

  console.log(result)

  if (result.rowsAffected[0] > 0) {
    let mailOptions = {
      from: '<e.transportation.saleticket@gmail.com>',
      subject: 'Đổi Mật Khẩu Thành Công',
      to: email,
      html: `
             <h3> Nếu Bạn Cần Hỗ Trợ <h3/>
             <h3> Hãy Liên Hệ Với Chúng Tôi<h3/>
             <h3> HotLine: 19990000 <h3/>
             <h3> Email: e.transportation.saleticket@gmail.com <h3/>`,
      text: 'Đổi Mật Khẩu Thành Công',
    };

    // send email with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: %s', info.messageId);
      }
    });
    res.status(200).json({
      message: 'Đổi Mật Khẩu Thành Công.',
      data: true,
    })
    return
  }

}




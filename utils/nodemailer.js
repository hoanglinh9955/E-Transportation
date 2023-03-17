const nodemailer = require('nodemailer');

// create transporter object using SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
        user: 'e.transportation.saleticket@gmail.com',
        pass: 'arexecmjooqdxwpp'
    }
});

module.exports = transporter;
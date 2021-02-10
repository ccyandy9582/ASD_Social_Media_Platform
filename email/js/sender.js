var nodemailer = require('nodemailer')

module.exports = (title, template) => {
    const transporter = nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "smtp.gmail.com",
        auth: {
            user: 'ccyandy9582@gmail.com',
            pass: 'yoszcmnjgsswblqj',
        },
        secure: true,
    })

    const mailData = {
        from: 'ccyandy9582@gmail.com',  // sender address
        to: 'ccyandy9582@gmail.com',   // list of receivers
        subject: title,
        html: template,
    }

    transporter.sendMail(mailData, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info)
    })
}
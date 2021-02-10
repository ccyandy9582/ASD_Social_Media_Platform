const fs = require('fs')
const parms = require('../../parms')
const sendMail = require('./sender')

module.exports = function (mail_type, key) {
    var path = __dirname
    path = path.replace('js', '')

    let temp = ""

    switch (mail_type) {
        case "auth":
            path = path + "auth_mail.html"
            fs.readFile(path, (err, mail) => {
                if (err) throw err
                temp = mail.toString()
                temp = temp.replace("{user}", "test_ccy")
                temp = temp.replace("{user}", "test_ccy")
                let link = `"http://localhost:3000/myinfo/auth?key=${key}"`
                temp = temp.replace("{link}", link)
                sendMail(parms.mail.auth.mail_title, temp)
            })
            break
        case "reset_pw":
            path = path + "reset_email.html"
            fs.readFile(path, (err, mail) => {
                if (err) throw err
                temp = mail.toString()
                temp = temp.replace("{user}", "test_ccy")
                temp = temp.replace("{user}", "test_ccy")
                let link = `"http://localhost:3000/myinfo/reset?key=${key}"`
                temp = temp.replace("{link}", link)
                sendMail(parms.mail.reset_pw.mail_title, temp)
            })
            break
    }
}
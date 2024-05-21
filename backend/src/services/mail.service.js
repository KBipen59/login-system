require('dotenv').config()
const nodemailer = require('nodemailer')

class MailService {
    transport;

    constructor(){
        try{
            // this.transport = nodemailer.createTransport({
            //     host: process.env.SMTP_HOST,
            //     port: process.env.SMTP_PORT, 
            //     auth: {
            //         user: process.env.SMTP_USER,
            //         pass: process.env.SMTP_PASSWORD
            //     }
            // })
            this.transport = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                service: process.env.SMTP_SERVICE,
                auth:{
                    user: process.env.SMTP_MAIL,
                    pass: process.env.SMTP_PASSWORD
                }
            })
        } catch (error) {
            console.log(error)
            throw new Error("Error connecting email service")
        }
    }

    sendEmail = async (to, subject, message, attachements = null) => {
        try {
            const mailStatus = await this.transport.sendMail({
                to: to,
                from: process.env.SMTP_FROM,
                subject: subject,
                html: message,
                attachments: attachements
            })

            return mailStatus
        } catch (error) {
            console.log(error)
            throw new Error("Error sending email...")
        }
    }
}

const mailSvc = new MailService()


module.exports = mailSvc
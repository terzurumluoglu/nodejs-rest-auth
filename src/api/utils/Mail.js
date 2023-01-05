const nodemailer = require('nodemailer');

class Mail {
    client;
    constructor() {
        this.client = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    send = async ({ to, subject, text }) => {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to,
            subject,
            text
        };
        await this.client.sendMail(mailOptions);
    };

}

module.exports = Mail;

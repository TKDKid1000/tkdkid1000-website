import nodemailer from "nodemailer"
import smtpTransport from "nodemailer-smtp-transport"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import utils from "./utils"

async function sendEmail(to: string, subject: string, text: string): Promise<SMTPTransport.SentMessageInfo> {
    const transport = nodemailer.createTransport(smtpTransport(utils.readJson("./smtpConfig.json")))
    const mail = await transport.sendMail({
        to: to,
        subject: subject,
        html: text
    })
    return mail
}

export {sendEmail}
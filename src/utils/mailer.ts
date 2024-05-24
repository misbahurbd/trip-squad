import nodemailer from "nodemailer"
import config from "../config"
import { AppError } from "../app/errors/app-error"
import httpStatus from "http-status"

const transporter = nodemailer.createTransport({
  service: "email",
  host: "smtp.gmail.com",
  port: config.env === "production" ? 465 : 587,
  secure: config.env === "production", // Use `true` for port 465, `false` for all other ports
  auth: {
    user: config.mailer.email,
    pass: config.mailer.pass,
  },
})

const sendMail = async (
  email: string,
  subject: string,
  emailTemplate: string
) => {
  try {
    const mail = await transporter.sendMail({
      from: {
        name: "Trip Squad",
        address: config.mailer.email!,
      },
      to: email,
      subject: subject,
      html: emailTemplate,
    })
    return mail
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Unable to send mail")
  }
}

export default sendMail

require("dotenv").config();
const nodemailer = require("nodemailer");
var mg = require("nodemailer-mailgun-transport");

const outlookTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailgunTransporter = nodemailer.createTransport(
  mg({
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    },
  })
);

module.exports = { outlookTransporter, mailgunTransporter };

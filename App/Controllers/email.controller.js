"use strict";
const nodemailer = require("nodemailer");
require("dotenv").config();
exports.sendTest = (req, res) => {
  // async..await is not allowed in global scope, must use a wrapper
  async function sendTest() {
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    /* 
    Inbound email is working fine with Plesk but outbound mails is not working.
    */
    transporter.sendMail(
      {
        from: "no-reply@ugotlead.dk",
        to: "anla@onlineplus.dk",
        subject: "Message",
        text: "I hope this message gets delivered!",
      },
      (err, info) => {
        console.log(info);
        console.log(err);
      }
    );
  }

  sendTest()
    .then((data) => {
      return res.status(200).send("Working");
    })
    .catch((e) => {
      return res.status(400).send("Didn't work");
    });
};

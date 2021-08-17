"use strict";
const nodemailer = require("nodemailer");

exports.sendTest = (req, res) => {
  // async..await is not allowed in global scope, must use a wrapper
  async function sendTest() {
    let transporter = nodemailer.createTransport({
      host: "172.20.221.3",
      port: 587,
      secure: false, // true for 465, false for other ports
    });

    transporter.sendMail(
      {
        from: "no-reply@api.ugotlead.dk",
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

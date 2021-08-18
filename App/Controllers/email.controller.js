"use strict";
const nodemailer = require("nodemailer");

exports.sendTest = (req, res) => {
  // async..await is not allowed in global scope, must use a wrapper
  async function sendTest() {
    let transporter = nodemailer.createTransport({
      host: "vm0349.enterprisecloud.nu",
      port: 465,
      secure: true, // true for 465, false for other ports,
      auth: {
        user: "no-reply@ugotlead.dk",
        pass: "Xav62115?",
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

"use strict";
const nodemailer = require("nodemailer");

exports.sendTest = (req, res) => {
  // async..await is not allowed in global scope, must use a wrapper
  async function sendTest() {
    let transporter = nodemailer.createTransport({
      host: "api.ugotlead.dk",
      port: 465,
      secure: true, // true for 465, false for other ports,
    });
    /* 
Inbound email is working fine with Plesk but outbound mails is not working.
Usually it gives Relay Access Denied
*/
    transporter.sendMail(
      {
        from: "no-reply@api.ugotlead.dk",
        to: "test@api.ugotlead.dk",
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

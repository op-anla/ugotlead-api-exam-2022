"use strict";
const mailSetup = require("../Models/email.model");
exports.sendTest = (req, res) => {
  // async..await is not allowed in global scope, must use a wrapper
  async function sendTest() {
    console.log("Do we have any inputs to take care of?", req.body);
    let toMail = "anla@onlineplus.dk";
    let content = `
    <p>Hej ${toMail}, <br><br>
    Skal du i gang med e-mail marketing, 
    eller trænger din nyhedsbrevsliste til et 
    friskt pust? Med en U GOT LEAD-kampagne kan 
    du hurtigt indsamle en masse nye læsere til 
    dit nyhedsbrev på en sjov og effektiv måde.</p>
    <br>
    <a href="https://ugotlead.dk/" target="_blank">Se vores hjemmeside her.</a>
    `;
    let subject = "UGOTLEAD - Gamification Product - Mail";
    // Setting the values to the req.body values if they exists
    if (req.body.mailInfo.to !== "") toMail = req.body.mailInfo.to;
    if (req.body.mailInfo.content !== "") content = req.body.mailInfo.content;
    if (req.body.mailInfo.subject !== "") subject = req.body.mailInfo.subject;
    console.log("Lets send the mail with these params", toMail, content);
    mailSetup.sendMail(
      {
        from: "no-reply@ugotlead.dk",
        to: toMail,
        subject: subject,
        html: content,
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
exports.sendUserEmailForPlaying = (req, res) => {
  // async..await is not allowed in global scope, must use a wrapper
  console.log(
    "The user has played, so let's see the data",
    req.body.redeemInfo
  );
  let toUserMail = req.body.redeemInfo.user.email;
  let toUserName = req.body.redeemInfo.user.name;
  let reward = req.body.redeemInfo.reward.reward;
  let didUserWin = req.body.redeemInfo.won;
  console.log(
    "Lets just check the data we send to the email. Did the user win? ",
    didUserWin,
    "What is the mail?",
    toUserMail,
    "What is the name?",
    toUserName,
    "what is the reward?",
    reward
  );
  if (didUserWin) {
    sendWinnerMail()
      .then((data) => {
        return res.status(200).send("working");
      })
      .catch((e) => {
        return res.status(400).send("Didn't work");
      });
  } else {
    sendLoserMail()
      .then((data) => {
        return res.status(200).send("working");
      })
      .catch((e) => {
        return res.status(400).send("Didn't work");
      });
  }
  async function sendWinnerMail() {
    // We send a winner mail here
    // mailSetup.sendMail(
    //   {
    //     from: "no-reply@ugotlead.dk",
    //     to: toMail,
    //     subject: subject,
    //     html: content,
    //   },
    //   (err, info) => {
    //     console.log(info);
    //     console.log(err);
    //   }
    // );
  }
  async function sendLoserMail() {
    // We send a winner mail here
    // mailSetup.sendMail(
    //   {
    //     from: "no-reply@ugotlead.dk",
    //     to: toMail,
    //     subject: subject,
    //     html: content,
    //   },
    //   (err, info) => {
    //     console.log(info);
    //     console.log(err);
    //   }
    // );
  }
};

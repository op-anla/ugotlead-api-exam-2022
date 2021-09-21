"use strict";
const mailSetup = require("../Models/emailsetup");
const EmailModel = require("../Models/emails.model");

exports.createMail = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("req.body", req.body);

  // Create a Campaign
  const email = new EmailModel({
    campaign_id: req.body.campaignid,
    email_logo_url: req.body.email_logo_url ? req.body.email_logo_url : "",
    email_win_text: req.body.emails.winner_email.content
      ? req.body.emails.winner_email.content
      : "",
    email_consolation_text: req.body.emails.consolation_email
      ? req.body.emails.consolation_email.content
      : "",
    email_custom_css: req.body.email_custom_css
      ? req.body.email_custom_css
      : "",
  });

  // Save Campaign in the database
  EmailModel.create(email, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the email.",
      });
    else res.status(201).send(data);
  });
};
exports.updateMail = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log("body in updateMail", req.body);
  const email = new EmailModel({
    campaign_id: req.body.campaignid,
    email_logo_url: req.body.email_logo_url ? req.body.email_logo_url : "",
    email_win_text: req.body.emails.winner_email.content
      ? req.body.emails.winner_email.content
      : "",
    email_consolation_text: req.body.emails.consolation_email
      ? req.body.emails.consolation_email.content
      : "",
    email_custom_css: req.body.email_custom_css
      ? req.body.email_custom_css
      : "",
  });
  EmailModel.updateById(email.campaign_id, email, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found email with campaign id ${email.campaign_id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error updating  email with campaign id " + email.campaign_id,
        });
      }
    } else res.send(data);
  });
};
exports.getEmailInfoForCampaign = (req, res) => {
  EmailModel.findById(req.params.campaignId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found campaign with id ${req.params.campaignId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving campaign with id " + req.params.campaignId,
        });
      }
    } else res.send(data);
  });
};
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
  /* 
  We will first get the email information from the database.
  We use this to generate the different emails.
  */
  console.log("The user has played, so let's see the data", req.body.payload);
  let campaignId = req.body.payload.redeemInfo.reward.reward.campaign_id;
  console.log("campaignId", campaignId);
  EmailModel.findById(campaignId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found email with campaign_id id ${campaignId}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving email with campaign_id id " + campaignId,
        });
      }
    } else {
      res.locals.emailInfo = data;
      sendEmail();
    }
  });
  /* 
  Now we have campaignid and emailinfo
  */
  function sendEmail() {
    console.log("let's see emailinfo ", res.locals.emailInfo);
    let emailInfo = res.locals.emailInfo;
    let toUserMail = req.body.payload.currentUser.email;
    let toUserName = req.body.payload.currentUser.navn;
    let reward = req.body.payload.redeemInfo.reward;
    let didUserWin = req.body.payload.redeemInfo.won;
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
      sendWinnerMail(toUserMail, toUserName, reward, emailInfo, didUserWin)
        .then((data) => {
          return res.status(200).send("working");
        })
        .catch((e) => {
          return res.status(400).send("Didn't work");
        });
    } else {
      sendLoserMail(toUserMail, toUserName, reward, emailInfo, didUserWin)
        .then((data) => {
          return res.status(200).send("working");
        })
        .catch((e) => {
          return res.status(400).send("Didn't work");
        });
    }
  }

  async function sendWinnerMail(
    userEmail,
    userName,
    reward,
    emailInfo,
    didUserWin
  ) {
    console.log(
      "sendWinnerMail ~ userEmail, userName, reward, emailInfo",
      userEmail,
      userName,
      reward,
      emailInfo
    );
    // We send a winner mail here
    let subject = "Tillykke ! - Du har vundet !";
    /* 
    We need to validate the emailinfo since we need some logo and other stuff
    */

    validateContent(userEmail, userName, reward, emailInfo, didUserWin)
      .then((formattedContent) => {
        mailSetup.sendMail(
          {
            from: "no-reply@ugotlead.dk",
            to: userEmail,
            subject: subject,
            html: formattedContent,
          },
          (err, info) => {
            if (err) {
              console.log(err);
              // Error
            } else {
              console.log(info);
              return res.status(200).send();
            }
          }
        );
      })
      .catch(() => {});
  }
  async function sendLoserMail(
    userEmail,
    userName,
    reward,
    emailInfo,
    didUserWin
  ) {
    console.log(
      "sendLoserMail ~ userEmail, userName, reward, emailInfo",
      userEmail,
      userName,
      reward,
      emailInfo
    );
    let subject = "Du vandt desværre ikke...";
    validateContent(userEmail, userName, reward, emailInfo, didUserWin)
      .then((formattedContent) => {
        console.log(".then ~ formattedContent", formattedContent);
        mailSetup.sendMail(
          {
            from: "no-reply@ugotlead.dk",
            to: userEmail,
            subject: subject,
            html: formattedContent,
          },
          (err, info) => {
            if (err) {
              console.log(err);
              // Error
            } else {
              console.log(info);
              return res.status(200).send();
            }
          }
        );
      })
      .catch(() => {});
    // We send a winner mail here
  }
  function validateContent(userEmail, userName, reward, emailInfo, didUserWin) {
    return new Promise((resolve, reject) => {
      console.log("We will validate this", emailInfo);

      if (didUserWin) {
        // We know the function was called from "Sendwinnermail"
        var content = emailInfo.email_win_text;
      } else {
        // We know the function was called from SendLoserMail
        var content = emailInfo.email_consolation_text;
      }
      // We now have the content we need
      console.log("what is the content for this specific case", content);
      // Validate now
      let regex = /\{{(.*?)\}}/g;
      let foundTags = content.match(regex);
      console.log("returnnewPromise ~ foundTags", foundTags);
      /* 
      TAG BANK
      */
      const tags = {
        tag_username: "user_name",
        tag_reward: "reward",
      };
      /* 
    -------------
    */
      if (foundTags.length) {
        // We actually found some tags
        let formattedContent = content;
        foundTags.forEach((tag) => {
          if (tag.includes(tags.tag_username)) {
            // Username check
            formattedContent = formattedContent.replace(
              `{{${tags.tag_username}}}`,
              userName
            );
          }
          if (tag.includes(tags.tag_reward)) {
            // Reward check
            let rewardContent = `
              <h3>Gevinst detaljer:<h3><br>
              <strong>Gevinst navn: ${reward.reward.reward_name}</strong>
              `;

            formattedContent = formattedContent.replace(
              `{{${tags.tag_reward}}}`,
              rewardContent
            );
          }
          // We also need to change data that is not correctly aligned with the syntax we use
          formattedContent = formattedContent.replace(tag, "undefined");
        });
        console.log("returnnewPromise ~ formattedContent", formattedContent);
        resolve(formattedContent);
      } else {
        // Didn't find any tags so just return it
        resolve(content);
      }
    });
  }
};

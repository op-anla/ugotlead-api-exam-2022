"use strict";
const mailSetup = require("../Models/emailsetup");
const EmailModel = require("../Models/emails.model");
const emailHelper = require("../common/helpers/emails");
const redisCache = require("./redisCache.controller.js");
const queueController = require("./queue.controller.js");

const dynamic_tag_handling = require("../common/helpers/dynamic_tag_handling");

const { checkMyJson } = require("../common/helpers/checkmyjson");
exports.createMail = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

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
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the email.",
      });
    } else {
      res.status(201).send(data);
    }
  });
};
exports.updateMail = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
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
    email_admin_text: req.body.emails.admin_email.content
      ? req.body.emails.admin_email.content
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
    } else {
      // Reset campaign cache for all campaigns
      redisCache.deleteKey(
        `cache_email_data_for_campaign_${email.campaign_id}`
      );
      res.send(data);
    }
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
    } else {
      res.send(data);
    }
  });
};
exports.sendTest = (req, res) => {
  // async..await is not allowed in global scope, must use a wrapper
  async function sendTest() {
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
    if (req.body.mailInfo.to !== "") {
      toMail = req.body.mailInfo.to;
    }
    if (req.body.mailInfo.content !== "") {
      content = req.body.mailInfo.content;
    }
    if (req.body.mailInfo.subject !== "") {
      subject = req.body.mailInfo.subject;
    }
    mailSetup
      .sendMail(
        {
          from: "no-reply@ugotlead.dk",
          to: toMail,
          subject: subject,
          html: content,
        },
        (err, info) => {
          console.log(err);
        }
      )
      .then((responseCode) => {
        return res.status(responseCode).send();
      })
      .catch((responseCode) => {
        return res.status(responseCode).send();
      });
  }

  sendTest()
    .then((data) => {
      return res.status(200).send("Working");
    })
    .catch((e) => {
      return res.status(400).send("Didn't work");
    });
};
exports.sendEmailToOperators = async (req, res) => {
  /* 
  We will first get the email information from the database.
  We check redis cache for this data first though before trying database
  We use this to generate the different emails.
  */
  //  Function first
  const sendEmailFunction = (inputRes, data) => {
    inputRes.locals.emailInfo = data;
    /* 
  Main promise array which will be used since there is chance for multiple emails to be sent. 
  We don't want to send a response after the first email that was sent correctly since it should show the user an error. 
  */
    // Main OBJECT
    let currentEmailTask = {};
    let emailObject = {
      returnDynamicContentPayload: {
        content: "",
        emailInfo: inputRes.locals.emailInfo,
        reward: inputRes.locals.redeemInfo.data.reward,
        didUserWin: inputRes.locals.redeemInfo.won,
        userInfo: inputRes.locals.playerData,
      },
      rewardMeta: inputRes.locals.rewardMeta,
      didUserWin: inputRes.locals.redeemInfo.won,
      toMail: inputRes.locals.playerData.player_email,
      subject: inputRes.locals.redeemInfo.won
        ? "Tillykke ! - Du har vundet !"
        : "Du vandt desværre ikke...",
      email_notification: checkMyJson(
        inputRes.locals.rewardMeta.reward_email_notification_info
      )
        ? JSON.parse(inputRes.locals.rewardMeta.reward_email_notification_info)
        : {},
    };
    if (emailObject.didUserWin) {
      emailObject.returnDynamicContentPayload.content =
        inputRes.locals.emailInfo.email_win_text;
    } else {
      emailObject.returnDynamicContentPayload.content =
        inputRes.locals.emailInfo.email_consolation_text;
    }
    emailObject.replaceContent = dynamic_tag_handling.returnDynamicContent(
      emailObject.returnDynamicContentPayload
    );

    // Check for lost reward since we always know what to send in that case
    if (!emailObject.didUserWin) {
      // User lost
      console.log("sendEmailFunction ~ emailObject", emailObject);
      currentEmailTask = {
        from: "no-reply@ugotlead.dk",
        to: emailObject.toMail,
        subject: emailObject.subject,
        content: emailObject.replaceContent,
      };
      queueController.addEmailToEmailQueue(currentEmailTask);
    }
    // We expect that the user has won here otherwise it would have returned above
    if (emailObject.email_notification.reward_mail_for_user == true) {
      // The reward that the user either won or lost has set to true which means the user should recieve email
      currentEmailTask = {
        from: "no-reply@ugotlead.dk",
        to: emailObject.toMail,
        subject: emailObject.subject,
        content: emailObject.replaceContent,
      };
      queueController.addEmailToEmailQueue(currentEmailTask);
    }
    if (emailObject.email_notification.reward_notification_for_owner == true) {
      // The reward has true setting for reward_notification for the owner which means the owner get's email too
      // We set the content to the admin_text since admin is the one to recieve this email
      emailObject.returnDynamicContentPayload.content =
        inputRes.locals.emailInfo.email_admin_text;
      emailObject.replaceContent = dynamic_tag_handling.returnDynamicContent(
        emailObject.returnDynamicContentPayload
      );
      currentEmailTask = {
        from: "no-reply@ugotlead.dk",
        to: "anla@onlineplus.dk",
        subject: "U GOT LEAD - En bruger har vundet en præmie!",
        content: emailObject.replaceContent,
      };
      queueController.addEmailToEmailQueue(currentEmailTask);
    }
  };
  // Check redis cache
  const cachedResponse = await redisCache.getKey(
    `cache_email_data_for_campaign_${req.params.campaignId}`
  );
  if (cachedResponse != null || cachedResponse != undefined) {
    let formattedResponse = JSON.parse(cachedResponse);
    sendEmailFunction(res, formattedResponse);
  }
  let campaignId = req.body.campaign.campaign_id;
  EmailModel.findById(campaignId, async (err, data) => {
    if (err) {
      throw err;
    } else {
      // Save in Redis cache
      redisCache.saveKey(
        `cache_email_data_for_campaign_${req.params.campaignId}`,
        60 * 60 * 24,
        JSON.stringify(data)
      );
      sendEmailFunction(res, data);
    }
  });
};

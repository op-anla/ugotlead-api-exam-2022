const campaign = require("./campaign.controller.js");
const emailHelper = require("../common/helpers/emails");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const fetch = require("node-fetch");
const queueController = require("./queue.controller.js");
const querystring = require("querystring");
const { URLSearchParams } = require("url");
const { encrypt, decrypt } = require("../common/middleware/crypto");
const db = require("../Models/db.js");
/* 
Version: 1.0
*/
const version = "v1";
const apiUrl = `${version}/api`;
// You should always store your client id and secret in environment variables for security
const MAILCHIMP_CLIENT_ID = process.env.MAILCHIMP_CLIENT_ID;
const MAILCHIMP_CLIENT_SECRET = process.env.MAILCHIMP_CLIENT_SECRET;
const BASE_URL = `http://127.0.0.1:3008/${apiUrl}`;
const OAUTH_CALLBACK = `${BASE_URL}/auth/mailchimp/login`;
exports.redirectToLogin = (req, res) => {
  /* 
  We redirect the user to the official Mailchimp oauth page where the user has to verify our App
  After they verify the application they will be redirected to another API Endpoint we have
  */
  res.redirect(
    `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
      response_type: "code",
      client_id: MAILCHIMP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK,
    })}`
  );
  // let url = `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify(
  //   {
  //     response_type: "code",
  //     client_id: MAILCHIMP_CLIENT_ID,
  //     redirect_uri: OAUTH_CALLBACK,
  //   }
  // )}`;
  // res.status(200).send(url);
  // return next();
};

exports.updateCampaignWithMailchimpInfo = async (req, res) => {
  /* 
  The user will be coming from the official Mailchimp oauth2 page with a code. 
  */
  /* 
  Check if cookies has the campaign id with it. If not return to the application with an error code  
  We send the campaign id cookie from the Nuxt application so our API knows which campaign to update with access token og DC.
  */
  const cookies = req.headers.cookie;
  let campaignId = null;
  if (cookies) {
    if (cookies.includes("auth.campaignid")) {
      const splitCookie = cookies.split("auth.campaignid=");
      campaignId = splitCookie[1].replace(/[^\d].*/, "");
    }
  }
  if (campaignId === null) {
    // We redirect the user back to our application with the campaign ID they were updating.
    return res.redirect(
      `http://127.0.0.1:8000/login/dashboard/campaign/${campaignId}#integrationer?mailchimpIntegration=fail`
    );
  }
  const {
    query: { code },
  } = req;
  // Here we're exchanging the temporary code for the user's access token.

  const tokenResponse = await fetch(
    "https://login.mailchimp.com/oauth2/token",
    {
      method: "POST",

      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: MAILCHIMP_CLIENT_ID,
        client_secret: MAILCHIMP_CLIENT_SECRET,
        redirect_uri: OAUTH_CALLBACK,
        code,
      }),
    }
  );
  const { access_token } = await tokenResponse.json();

  // Now we're using the access token to get information about the user.
  // Specifically, we want to get the user's server prefix, which we'll use to
  // make calls to the API on their behalf.  This prefix will change from user
  // to user.

  const metadataResponse = await fetch(
    "https://login.mailchimp.com/oauth2/metadata",
    {
      headers: {
        Authorization: `OAuth ${access_token}`,
      },
    }
  );

  const { dc } = await metadataResponse.json();
  /* 
   First we encrypt the accesstoken and send that to the DB
   The campaign the user is updating will be the mailchimp integration for that specific campaign
   */
  // Encrypt the access_token
  const hashAccess_token = encrypt(access_token);
  const campaignMailchimp = {
    mailchimp: {
      dc: dc,
      access_token: hashAccess_token,
    },
  };

  // Waiting to update
  await campaign.updateMailchimpAfterIntegration(campaignId, campaignMailchimp);

  // Below, we're using the access token and server prefix to make an
  // authenticated request on behalf of the user who just granted OAuth access.

  mailchimp.setConfig({
    accessToken: access_token,
    server: dc,
  });

  // We redirect the user back to our application with the campaign ID they were updating.
  res.redirect(
    `http://127.0.0.1:8000/login/dashboard/campaign/${campaignId}#integrationer?mailchimpIntegration=success`
  );
};

exports.getAudienceLists = async (req, res) => {
  /* 
  Here we get lists available from Mailchimp with the access token og DC.
  */
  let mailchimpInfo = "";
  if (req.headers.mailchimpinfo) {
    mailchimpInfo = JSON.parse(req.headers.mailchimpinfo);
  } else {
    res.status(400).send("You didn't include any Mailchimp Info in the header");
  }
  mailchimp.setConfig({
    accessToken: decrypt(mailchimpInfo.access_token),
    server: mailchimpInfo.dc,
  });
  const response = await mailchimp.lists.getAllLists();
  const lists = response.lists;
  res.send({
    lists,
  });
};
exports.addMemberToMailchimp = async (userTask) => {
  /* 
  This endpoint will add members to the list from request. The information required will normally be
  fullname and email. 
  */
  //  Check some validation
  if (!userTask.userInfo.navn || !userTask.userInfo.email) {
    throw new Error("Please provide the correct userInfo in the body");
  }
  // Check header information
  if (!userTask.mailchimpinfo) {
    throw new Error("Please provide the correct mailchimp info");
  }

  let mailchimpInfo = userTask.mailchimpinfo;
  mailchimpInfo.access_token = decrypt(mailchimpInfo.access_token);
  mailchimp.setConfig({
    accessToken: mailchimpInfo.access_token,
    server: mailchimpInfo.dc,
  });
  const mergeFields = {
    FNAME: userTask.userInfo.navn,
  };
  try {
    const addMemberResponse = await mailchimp.lists.addListMember(
      mailchimpInfo.listID,
      {
        email_address: userTask.userInfo.email,
        merge_fields: mergeFields,
        status: "subscribed",
      }
    );
    return { id: addMemberResponse.id, status: addMemberResponse.status };
  } catch (err) {
    let message = `${err}`;
    let emailTask = {
      from: "no-reply@ugotlead.dk",
      to: "anla@onlineplus.dk",
      subject: "Error in mailchimp",
      content: message,
    };
    queueController.addEmailToEmailQueue(emailTask);
    throw err;
  }
};

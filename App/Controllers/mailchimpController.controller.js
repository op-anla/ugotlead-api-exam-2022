const campaigns = require("./campaign.controller.js");
const player = require("./player.controller.js");

const mailchimp = require("@mailchimp/mailchimp_marketing");
const fetch = require("node-fetch");
const querystring = require("querystring");
const { URLSearchParams } = require("url");
const { encrypt, decrypt } = require("../common/middleware/crypto");
const checkJson = require("../common/helpers/checkmyjson");
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
exports.redirectToLogin = (req, res, next) => {
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

exports.updateCampaignWithMailchimpInfo = async (req, res, next) => {
  /* 
  The user will be coming from the official Mailchimp oauth2 page with a code. 
  */
  /* 
  Check if cookies has the campaign id with it. If not return to the application with an error code  
  We send the campaign id cookie from the Nuxt application so our API knows which campaign to update with access token og DC.
  */
  const cookies = req.headers.cookie;
  var campaignId = null;
  if (cookies) {
    if (cookies.includes("auth.campaignid")) {
      const splitCookie = cookies.split("auth.campaignid=");
      campaignId = splitCookie[1].replace(/[^\d].*/, "");
    }
  }
  console.log(
    "exports.updateCampaignWithMailchimpInfo= ~ campaignId",
    campaignId
  );
  if (campaignId === null) {
    // We redirect the user back to our application with the campaign ID they were updating.
    return res.redirect(
      `http://127.0.0.1:3000/login/dashboard/campaign/${campaignId}#integrationer?mailchimpIntegration=fail`
    );
  }
  const {
    query: { code },
  } = req;
  console.log("Mailchimp login", code);
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
  const stringifyInfo = JSON.stringify(campaignMailchimp);
  console.log(
    "🚀 ~ file: server.js ~ line 192 ~ router.get ~ stringifyInfo",
    stringifyInfo
  );
  // Waiting to update

  campaigns.updateMailchimp(campaignId, campaignMailchimp);

  // Below, we're using the access token and server prefix to make an
  // authenticated request on behalf of the user who just granted OAuth access.

  mailchimp.setConfig({
    accessToken: access_token,
    server: dc,
  });

  // We redirect the user back to our application with the campaign ID they were updating.
  res.redirect(
    `http://127.0.0.1:3000/login/dashboard/campaign/${campaignId}#integrationer?mailchimpIntegration=success`
  );
};

exports.getAudienceLists = async (req, res, next) => {
  /* 
  Here we get lists available from Mailchimp with the access token og DC.
  */
  console.log(
    "🚀 ~ file: server.js ~ line 257 ~ router.get ~ req",
    req.headers
  );
  var mailchimpInfo = "";
  if (req.headers.mailchimpinfo) {
    console.log("Included mailchimpinfo");
    mailchimpInfo = JSON.parse(req.headers.mailchimpinfo);
  } else {
    console.log("Didn't include mailchimp info");
    res.status(400).send("You didn't include any Mailchimp Info in the header");
  }
  console.log("exports.getAudienceLists= ~ mailchimpInfo", mailchimpInfo);
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
exports.addMemberToMailchimp = async (req, res, next) => {
  /* 
  This endpoint will add members to the list from request. The information required will normally be
  fullname and email. 
  */
  //  We start with basic validation of the request
  console.log("checking body", req.body);
  console.log("checking headers", req.headers);
  if (!req.body.navn || !req.body.email)
    return res
      .status(400)
      .send("Please provide the correct userInfo in the body");
  if (!req.headers.mailchimpinfo)
    return res.status(400).send("Please provide the correct mailchimp info");

  const mailchimpInfo = JSON.parse(req.headers.mailchimpinfo);

  console.log(
    "We now continue after validation with current variables: ",
    mailchimpInfo,
    req.body
  );
  mailchimpInfo.access_token = decrypt(mailchimpInfo.access_token);
  console.log("exports.addMemberToMailchimp= ~ access_token", mailchimpInfo);
  // Remember to DECRYPT WHEN FIXED
  mailchimp.setConfig({
    accessToken: mailchimpInfo.access_token,
    server: mailchimpInfo.dc,
  });
  const mergeFields = {
    FNAME: req.body.navn,
  };

  try {
    await mailchimp.lists.addListMember(mailchimpInfo.selectedListId, {
      email_address: req.body.email,
      merge_fields: mergeFields,
      status: "subscribed",
    });

    /* 
    Now we will create the player in our DB
    */
    player.createPlayer(req, res);
  } catch (error) {
    let responseCode = error.status;
    console.log("exports.addMemberToMailchimp= ~ error", error.status);

    if (responseCode === undefined) {
      responseCode = 404;
    }
    res.status(responseCode).send(error);
  }
};

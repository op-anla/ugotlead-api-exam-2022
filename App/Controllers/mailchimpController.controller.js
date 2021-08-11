const campaigns = require("./campaign.controller.js");
const player = require("./player.controller.js");

const mailchimp = require("@mailchimp/mailchimp_marketing");
const fetch = require("node-fetch");
const querystring = require("querystring");
const { URLSearchParams } = require("url");
/* 
Version: 1.0
*/
const version = "v1";
const apiUrl = `${version}/api`;
// You should always store your client id and secret in environment variables for security
const MAILCHIMP_CLIENT_ID = process.env.MAILCHIMP_CLIENT_ID;
const MAILCHIMP_CLIENT_SECRET = process.env.MAILCHIMP_CLIENT_SECRET;
const BASE_URL = `http://127.0.0.1:3005/${apiUrl}`;
const OAUTH_CALLBACK = `${BASE_URL}/auth/mailchimp/login`;
exports.redirectToLogin = (req, res, next) => {
  /* 
  We redirect the user to the official Mailchimp oauth page where the user has to verify our App
  After they verify the application they will be redirected to another API Endpoint we have
  */
  // res.redirect(
  //   `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
  //     response_type: "code",
  //     client_id: MAILCHIMP_CLIENT_ID,
  //     redirect_uri: OAUTH_CALLBACK
  //   })}`
  // );
  let url = `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify(
    {
      response_type: "code",
      client_id: MAILCHIMP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK,
    }
  )}`;
  res.status(200).send(url);
  return next();
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

  console.log("checking campaign id outside loop", campaignId);
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
  const campaignMailchimp = {
    dc: dc,
    access_token: access_token,
  };
  const stringifyInfo = JSON.stringify(campaignMailchimp);
  console.log(
    "🚀 ~ file: server.js ~ line 192 ~ router.get ~ stringifyInfo",
    stringifyInfo
  );

  campaigns.updateMailchimp(campaignId, stringifyInfo);
  // Below, we're using the access token and server prefix to make an
  // authenticated request on behalf of the user who just granted OAuth access.

  mailchimp.setConfig({
    accessToken: access_token,
    server: dc,
  });

  const response = await mailchimp.lists.getAllLists();
  const stringifyList = JSON.stringify(response.lists);
  campaigns.updateMailchimpList(campaignId, stringifyList);
  // We redirect the user back to our application with the campaign ID they were updating.
  res.redirect(`http://127.0.0.1:3000/login/dashboard/campaign/${campaignId}`);
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
  mailchimp.setConfig({
    accessToken: mailchimpInfo.access_token,
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
  if (!req.body.currentUser.navn || !req.body.currentUser.email)
    return res
      .status(400)
      .send("Please provide the correct userInfo in the body");
  if (!req.headers.mailchimplistid || !req.headers.mailchimpinfo)
    return res.status(400).send("Please provide the correct mailchimp info");
  const mailchimpInfo = req.body.currentUser;
  console.log(
    "🚀 ~ file: server.js ~ line 274 ~ router.post ~ mailchimpInfo",
    mailchimpInfo
  );
  const mailchimpListId = req.headers.mailchimplistid;
  console.log(
    "🚀 ~ file: server.js ~ line 275 ~ router.post ~ mailchimpListId",
    typeof mailchimpListId
  );
  const mailchimpAccessInfo = JSON.parse(req.headers.mailchimpinfo);
  console.log(
    "🚀 ~ file: server.js ~ line 277 ~ router.post ~ mailchimpAccessInfo",
    typeof mailchimpAccessInfo
  );
  mailchimp.setConfig({
    accessToken: mailchimpAccessInfo.access_token,
    server: mailchimpAccessInfo.dc,
  });
  const mergeFields = {
    FNAME: mailchimpInfo.navn,
  };

  try {
    const response = await mailchimp.lists.addListMember(
      parseInt(mailchimpListId),
      {
        email_address: mailchimpInfo.email,
        merge_fields: mergeFields,
        status: "subscribed",
      }
    );
    console.log(
      "🚀 ~ file: server.js ~ line 311 ~ router.post ~ response",
      response
    );
    /* 
    Now we will create the player in our DB
    */
    player.createPlayer(req, res);
    // res.status(200).send("Added member");
  } catch (error) {
    console.log("🚀 ~ file: server.js ~ line 293 ~ router.post ~ error", error);
    res.status(400).send(error);
  }
};

"use strict"
// Used services
const express = require("express")
const serverless = require("serverless-http")
const app = express()
const bodyParser = require("body-parser")
const router = express.Router()
var cors = require('cors')
const mailchimp = require("@mailchimp/mailchimp_marketing");
const fetch = require("node-fetch");
const {
  URLSearchParams
} = require("url");
const querystring = require("querystring");
/* 
-----------------------------------------------
CONTROLLERS
-----------------------------------------------
*/
const campaigns = require("../App/Controllers/campaign.controller.js");
const companies = require("../App/Controllers/companies.controller.js");
const rewards = require("../App/Controllers/rewards.controller.js");
const reward_meta = require("../App/Controllers/reward_meta.controller.js");
const layout = require("../App/Controllers/layout.controller.js");
const logging = require("../App/Controllers/logging.controller.js");
const player = require("../App/Controllers/player.controller.js");
const user = require("../App/Controllers/user.controller.js");
const entry = require("../App/Controllers/entry.controller.js");
const AuthorizationController = require("../App/auth/controllers/authorization.controller.js");
// Middleware
const VerifyUserMiddleware = require('../App/auth/middleware/verify.user.middleware')
const RedeemValidation = require('../App/common/middleware/redeem.validation.middleware')
const ValidationMiddleware = require('../App/common/middleware/auth.validation.middleware')
const RequestValidation = require('../App/common/middleware/request.validation.middleware')
// App uses
app.use(cors({
  origin: '*'
}))
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json())
app.use("/.netlify/functions/server", router) // path must route to lambda
app.use("/", router);
// Router
router.get("/", (req, res) => {
  res.write("<h1>Server is up and running! Make your requests</h1>")
  res.end()
})
/* 
Version: 1.0
*/
const version = "v1";
const apiUrl = `${version}/api`
/* 
-----------------------------------------------
CAMPAIGNS
-----------------------------------------------
*/
router.get(`/${apiUrl}/campaigns`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("Testing /campaigns");
  campaigns.findAll(req, res);
})
router.get(`/${apiUrl}/campaigns/:campaignId`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("Testing individual campaign");
  campaigns.findOne(req, res);
})
router.post(`/${apiUrl}/create-campaign`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    campaigns.create(req, res);
});
router.put(`/${apiUrl}/update-campaign/:campaignId`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    campaigns.update(req, res);
});
router.delete(`/${apiUrl}/delete-campaign/:campaignId`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    campaigns.delete(req, res);
});
/* 
-----------------------------------------------
LAYOUT FOR CAMPAIGNS
EXTENDED CAMPAIGN
-----------------------------------------------
*/
router.get(`/${apiUrl}/layout/campaign/:campaignId`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("Testing /layout/campaing/:campaignId");
  layout.findLayoutForSpecificCampaign(req, res);
})
router.put(`/${apiUrl}/update-layout/campaign/:campaignId`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    layout.updateLayoutForSpecificCampaign(req, res);
});
/* 
-----------------------------------------------
COMPANIES
-----------------------------------------------
*/
router.post(`/${apiUrl}/create-company`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    companies.create(req, res);
});
router.get(`/${apiUrl}/companies`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("Testing /companies");
  companies.findAll(req, res);
})
/* 
-----------------------------------------------
USERS
Later we will have Auth endpoints for our JWT based login
-----------------------------------------------
*/
router.post(`/${apiUrl}/user`, [
  user.create
])
router.get(`/${apiUrl}/user/:userId`, [
  ValidationMiddleware.validJWTNeeded,
  user.getById
])
router.get(`/${apiUrl}/user`, [
  ValidationMiddleware.validJWTNeeded,
  user.getByToken
])
router.put(`/${apiUrl}/user/:userId`, [
  ValidationMiddleware.validJWTNeeded,
  user.putById
])
router.get(`/${apiUrl}/users`, [
  ValidationMiddleware.validJWTNeeded,
  user.getAll
])
router.delete(`/${apiUrl}/user/:userId`, [
  ValidationMiddleware.validJWTNeeded,
  user.deleteUser
])
/* 
-----------------------------------------------
AUTH
Extending the USER part - This is Auth with internal JWT Login
-----------------------------------------------
*/
router.post(`/${apiUrl}/auth`, [
  VerifyUserMiddleware.hasAuthValidFields,
  VerifyUserMiddleware.isPasswordAndUserMatch,
  AuthorizationController.login

])
/* 
-----------------------------------------------
MAILCHIMP 
This is actually extending the Campaign because each campaign will have auth endpoints for mailchimp
The Maillchimp info will also be saved for that specific campaign and not on the specific user. 
-----------------------------------------------
*/
// You should always store your client id and secret in environment variables for security
const MAILCHIMP_CLIENT_ID = process.env.MAILCHIMP_CLIENT_ID;
const MAILCHIMP_CLIENT_SECRET = process.env.MAILCHIMP_CLIENT_SECRET;
const BASE_URL = `http://127.0.0.1:3005/${apiUrl}`;
const OAUTH_CALLBACK = `${BASE_URL}/auth/mailchimp/login`;

router.get(`/${apiUrl}/auth/mailchimp/`, (req, res) => {
  /* 
  We redirect the user to the official Mailchimp oauth page where the user has to verify our App
  After they verify the application they will be redirected to another API Endpoint we have
  */
  ValidationMiddleware.validJWTNeeded;
  res.redirect(`https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
      response_type: "code",
      client_id: MAILCHIMP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK
  })}`)
})

router.get(`/${apiUrl}/auth/mailchimp/login`, async (req, res) => {
  /* 
  The user will be coming from the official Mailchimp oauth2 page with a code. 
  */
  ValidationMiddleware.validJWTNeeded;
  /* 
  Check if cookies has the campaign id with it. If not return to the application with an error code  
  We send the campaign id cookie from the Nuxt application so our API knows which campaign to update with access token og DC.
  */
  const cookies = req.headers.cookie;
  var campaignId = null;
  if (cookies) {
    if (cookies.includes('auth.campaignid')) {
      const splitCookie = cookies.split('auth.campaignid=')
      campaignId = splitCookie[1].replace(/[^\d].*/, '');
    }
  }

  console.log("checking campaign id outside loop", campaignId)
  const {
    query: {
      code
    }
  } = req;
  console.log("Mailchimp login", code)
  // Here we're exchanging the temporary code for the user's access token.

  const tokenResponse = await fetch(
    "https://login.mailchimp.com/oauth2/token", {
      method: "POST",

      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: MAILCHIMP_CLIENT_ID,
        client_secret: MAILCHIMP_CLIENT_SECRET,
        redirect_uri: OAUTH_CALLBACK,
        code
      })
    }
  );


  const {
    access_token
  } = await tokenResponse.json();

  // Now we're using the access token to get information about the user.
  // Specifically, we want to get the user's server prefix, which we'll use to
  // make calls to the API on their behalf.  This prefix will change from user
  // to user.

  const metadataResponse = await fetch(
    "https://login.mailchimp.com/oauth2/metadata", {
      headers: {
        Authorization: `OAuth ${access_token}`
      }
    }
  );

  const {
    dc
  } = await metadataResponse.json();
  /* 
   First we encrypt the accesstoken and send that to the DB
   The campaign the user is updating will be the mailchimp integration for that specific campaign
   */
  const campaignMailchimp = {
    "dc": dc,
    "access_token": access_token
  }
  const stringifyInfo = JSON.stringify(campaignMailchimp)
  console.log("🚀 ~ file: server.js ~ line 192 ~ router.get ~ stringifyInfo", stringifyInfo)

  campaigns.updateMailchimp(campaignId, stringifyInfo)
  // Below, we're using the access token and server prefix to make an
  // authenticated request on behalf of the user who just granted OAuth access.
  // You wouldn't keep this in your production code, but it's here to
  // demonstrate how the call is made.

  mailchimp.setConfig({
    accessToken: access_token,
    server: dc
  });

  const response = await mailchimp.lists.getAllLists();
  const stringifyList = JSON.stringify(response.lists);
  campaigns.updateMailchimpList(campaignId, stringifyList)
  // We redirect the user back to our application with the campaign ID they were updating. 
  res.redirect(`http://127.0.0.1:3000/login/dashboard/campaign/${campaignId}`)

})
router.get(`/${apiUrl}/getlists`, async (req, res) => {
  /* 
  Here we get lists available from Mailchimp with the access token og DC.
  */
  ValidationMiddleware.validJWTNeeded;
  // console.log("🚀 ~ file: server.js ~ line 257 ~ router.get ~ req", req.headers)
  const mailchimpInfo = JSON.parse(req.headers.mailchimpinfo);
  mailchimp.setConfig({
    accessToken: mailchimpInfo.access_token,
    server: mailchimpInfo.dc
  });
  const response = await mailchimp.lists.getAllLists();
  const lists = response.lists
  res.send({
    lists
  })
})
router.post(`/${apiUrl}/addmember`, async (req, res) => {
  /* 
  This endpoint will add members to the list from request. The information required will normally be
  fullname and email. 
  */
  ValidationMiddleware.validJWTNeeded;
  const mailchimpInfo = req.body.currentUser;
  console.log("🚀 ~ file: server.js ~ line 274 ~ router.post ~ mailchimpInfo", mailchimpInfo)
  const mailchimpListId = req.headers.mailchimplistid
  console.log("🚀 ~ file: server.js ~ line 275 ~ router.post ~ mailchimpListId", mailchimpListId)
  const mailchimpAccessInfo = JSON.parse(req.headers.mailchimpinfo);
  console.log("🚀 ~ file: server.js ~ line 277 ~ router.post ~ mailchimpAccessInfo", mailchimpAccessInfo)
  mailchimp.setConfig({
    accessToken: mailchimpAccessInfo.access_token,
    server: mailchimpAccessInfo.dc
  });
  const mergeFields = {
    FNAME: mailchimpInfo.navn
  };

  try {
    const response = await mailchimp.lists.addListMember(mailchimpListId, {
      email_address: mailchimpInfo.email,
      merge_fields: mergeFields,
      status: "subscribed",
    });
    // console.log("🚀 ~ file: server.js ~ line 311 ~ router.post ~ response", response)
    /* 
    Now we will create the player in our DB
    */
    player.createPlayer(req, res);
    // res.status(200).send("Added member");
  } catch (error) {
    console.log("🚀 ~ file: server.js ~ line 293 ~ router.post ~ error", error.response.text)
    res.status(400).send(error.response.text)
  }
})
/* 
-----------------------------------------------
REWARDS 
-----------------------------------------------
*/
router.get(`/${apiUrl}/rewards/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  rewards.findRewardsByCampaignId,
])
router.get(`/${apiUrl}/rewards-meta/:rewardId`, [
  ValidationMiddleware.validJWTNeeded,
  reward_meta.findRewardMetaForReward,
])
router.post(`/${apiUrl}/create-reward`, [
  ValidationMiddleware.validJWTNeeded,
  rewards.create,
  reward_meta.create
])
router.put(`/${apiUrl}/update-reward/:reward_id`, [
  ValidationMiddleware.validJWTNeeded,
  rewards.updateById,
  reward_meta.updateById
])
router.delete(`/${apiUrl}/delete-reward/:reward_id`, [
  ValidationMiddleware.validJWTNeeded,
  reward_meta.deleteById,
  rewards.deleteById
])

/* 
-----------------------------------------------
LOGGGING 
-----------------------------------------------
*/
router.get(`/${apiUrl}/checklogging/:campaignId`, [
  logging.findLogForUser
])
router.post(`/${apiUrl}/create-logging/:campaignId`, [
  logging.createLogForUser
])
/* 
-----------------------------------------------
REWARD AND REDEEM 
-----------------------------------------------
*/
router.post(`/${apiUrl}/checkreward/:campaignId`, [
  RequestValidation.validateDomain,
  rewards.getAllRewardsForRedeem,
  RedeemValidation.didUserWin,
  entry.createEntry
])

module.exports = app
module.exports.handler = serverless(app)

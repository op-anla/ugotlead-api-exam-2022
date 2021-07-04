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
// Controller
const campaigns = require("../App/Controllers/campaign.controller.js");
const companies = require("../App/Controllers/companies.controller.js");
const user = require("../App/Controllers/user.controller.js");
const AuthorizationController = require("../App/auth/controllers/authorization.controller.js");
// Middleware
const VerifyUserMiddleware = require('../App/auth/middleware/verify.user.middleware')
const ValidationMiddleware = require('../App/common/middleware/auth.validation.middleware')
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

  // let url = `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
  //     response_type: "code",
  //     client_id: MAILCHIMP_CLIENT_ID,
  //   redirect_uri: OAUTH_CALLBACK,
  // })}`
  // res.send({
  //   url: url
  // });
  res.redirect(`https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
      response_type: "code",
      client_id: MAILCHIMP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK
  })}`)
})

router.get(`/${apiUrl}/auth/mailchimp/login`, async (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("🚀 ~ file: server.js ~ line 143 ~ router.get ~ req")
  /* 
  Check if cookies has the campaign id with it. If not return to the application with an error code  
  We send the campaign id cookie from the Nuxt application so our API knows which campaign to update with access token og DC.
  */
  const cookies = req.headers.cookie;
  var campaignId = null;
  if (cookies) {
    if (cookies.includes('auth.campaignid')) {
      // console.log("found campaign id in cookies")
      const splitCookie = cookies.split('auth.campaignid=')
      // console.log("split the cookie", splitCookie)
      campaignId = splitCookie[1].replace(/[^\d].*/, '');
    }
  }

  console.log("checking campaign id outside loop", campaignId)
  // const {
  //   headers: {
  //     code
  //   }
  // } = req;
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
  // console.log("🚀 ~ file: server.js ~ line 167 ~ router.get ~ access_token", access_token)
  // console.log("🚀 ~ file: server.js ~ line 167 ~ router.get ~ access_token", await tokenResponse.json())

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
  // console.log("🚀 ~ file: server.js ~ line 184 ~ router.get ~ dc", dc)
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
  console.log(response);
  const stringifyList = JSON.stringify(response.lists);
  campaigns.updateMailchimpList(campaignId, stringifyList)
  res.redirect(`http://127.0.0.1:3000/login/dashboard/campaign/${campaignId}`)
  // res.redirect(`http://127.0.0.1:3000/login/dashboard/campaign/1`)

  // res.send(`
  //   <p>This user's access token is ${access_token} and their server prefix is ${dc}.</p>

  //   <p>When pinging the Mailchimp Marketing API's ping endpoint, the server responded:<p>

  //   <code>${response}</code>
  // `);
})
router.get(`/${apiUrl}/getlists`, async (req, res) => {
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
    // console.log("response: ", response);
    res.status(200).send("Added member");
  } catch (error) {
    console.log("🚀 ~ file: server.js ~ line 293 ~ router.post ~ error", error.response.text)
    res.status(400).send(error.response.text)
  }

  // res.send(response)
})
router.get(`/${apiUrl}/checkreward`, async (req, res) => {
  const user = {
    name: req.headers.username,
    email: req.headers.useremail
  }
  if (user.name === "" || user.email === "") {
    res.status(400).send("Error: User hasn't been submitted")
    console.log("Error: User hasn't been submitted")
  } else {

  }
  console.log("🚀 ~ file: server.js ~ line 306 ~ router.get ~ user", user)
})
module.exports = app
module.exports.handler = serverless(app)

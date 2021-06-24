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
// CAMPAIGNS
router.get("/campaigns", (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("Testing /campaigns");
  campaigns.findAll(req, res);
})
router.get("/campaigns/:campaignId", (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("Testing individual campaign");
  campaigns.findOne(req, res);
})
router.post('/create-campaign', (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    campaigns.create(req, res);
});
router.put('/update-campaign/:campaignId', (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    campaigns.update(req, res);
});
router.delete('/delete-campaign/:campaignId', (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    campaigns.delete(req, res);
});
// COMPANIES
router.post('/create-company', (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    companies.create(req, res);
});
router.get("/companies", (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("Testing /companies");
  companies.findAll(req, res);
})
// Users
/* 
USERS:
These are all the user endpoints
*/
router.post('/user', [
  user.create
])
router.get('/user/:userId', [
  ValidationMiddleware.validJWTNeeded,
  user.getById
])
router.get('/user', [
  ValidationMiddleware.validJWTNeeded,
  user.getByToken
])
router.put('/user/:userId', [
  ValidationMiddleware.validJWTNeeded,
  user.putById
])
router.get('/users', [
  ValidationMiddleware.validJWTNeeded,
  user.getAll
])
router.delete('/user/:userId', [
  ValidationMiddleware.validJWTNeeded,
  user.deleteUser
])
/* 
Auth endpoints:
We use a JWT based login system - These endpoints are required for the app to work
You will also notice we have endpoints for Mailchimp. We use this endpoint to create the Oauth2 integration
*/
router.post('/auth', [
  VerifyUserMiddleware.hasAuthValidFields,
  VerifyUserMiddleware.isPasswordAndUserMatch,
  AuthorizationController.login

])
/* 
MAILCHIMP
*/
// You should always store your client id and secret in environment variables for security — the exception: sample code.
const MAILCHIMP_CLIENT_ID = process.env.MAILCHIMP_CLIENT_ID;
const MAILCHIMP_CLIENT_SECRET = process.env.MAILCHIMP_CLIENT_SECRET;
const BASE_URL = "http://127.0.0.1:3000";
const OAUTH_CALLBACK = `${BASE_URL}/login/dashboard/create-campaign`;
router.get("/test", function (req, res) {
  res.send(
    '<p>Welcome to the sample Mailchimp OAuth app! Click <a href="/auth/mailchimp">here</a> to log in</p>'
  );
});
router.get('/auth/mailchimp/', (req, res) => {
  // let url = `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
  //     response_type: "code",
  //     client_id: MAILCHIMP_CLIENT_ID,
  //     redirect_uri: OAUTH_CALLBACK
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

router.get('/auth/mailchimp/login', async (req, res) => {

  const {
    headers: {
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
  console.log("🚀 ~ file: server.js ~ line 167 ~ router.get ~ access_token", access_token)
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
  console.log("🚀 ~ file: server.js ~ line 184 ~ router.get ~ dc", dc)


  // Below, we're using the access token and server prefix to make an
  // authenticated request on behalf of the user who just granted OAuth access.
  // You wouldn't keep this in your production code, but it's here to
  // demonstrate how the call is made.

  mailchimp.setConfig({
    accessToken: access_token,
    server: dc
  });

  const response = await mailchimp.ping.get();
  console.log(response);

  res.send(`
    <p>This user's access token is ${access_token} and their server prefix is ${dc}.</p>

    <p>When pinging the Mailchimp Marketing API's ping endpoint, the server responded:<p>

    <code>${response}</code>
  `);
})

module.exports = app
module.exports.handler = serverless(app)

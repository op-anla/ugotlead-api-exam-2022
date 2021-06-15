"use strict"
// Used services
const express = require("express")
const serverless = require("serverless-http")
const app = express()
const bodyParser = require("body-parser")
const router = express.Router()
var cors = require('cors')
const mailchimp = require("@mailchimp/mailchimp_marketing");
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
const BASE_URL = "http://localhost:3005";
const OAUTH_CALLBACK = `${BASE_URL}/oauth/mailchimp/callback`;
router.get('/auth/mailchimp', (req, res) => {
  res.redirect(`https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
      response_type: "code",
      client_id: MAILCHIMP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK
    })}`)
})

module.exports = app
module.exports.handler = serverless(app)

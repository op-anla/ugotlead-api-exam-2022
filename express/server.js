"use strict"
// Used services
const express = require("express")
const serverless = require("serverless-http")
const app = express()
const bodyParser = require("body-parser")
const router = express.Router()
var cors = require('cors')

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

const layoutWidgets = require("../App/Controllers/layout-widgets.controller.js");
const user = require("../App/Controllers/user.controller.js");
const entry = require("../App/Controllers/entry.controller.js");
const mailchimpController = require("../App/Controllers/mailchimpController.controller.js");
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
router.get(`/${apiUrl}/campaign-stats/:campaignId`, (req, res) => {
  ValidationMiddleware.validJWTNeeded,
    console.log("Testing /campaigns/campaignstats");
  campaigns.findStatsForCampaign(req, res);
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


router.get(`/${apiUrl}/auth/mailchimp/`, [
  ValidationMiddleware.validJWTNeeded,
  mailchimpController.redirectToLogin
])

router.get(`/${apiUrl}/auth/mailchimp/login`, [
  ValidationMiddleware.validJWTNeeded,
  mailchimpController.updateCampaignWithMailchimpInfo,

])
router.get(`/${apiUrl}/getlists`, [
  ValidationMiddleware.validJWTNeeded,
  mailchimpController.getAudienceLists
])
router.post(`/${apiUrl}/addmember`, [
  ValidationMiddleware.validJWTNeeded,
  mailchimpController.addMemberToMailchimp
])
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
/* 
-----------------------------------------------
LAYOUT AND WIDGETS
-----------------------------------------------
*/
router.post(`/${apiUrl}/layout/create-widget`, [
  ValidationMiddleware.validJWTNeeded,
  layoutWidgets.createwidget
])
router.put(`/${apiUrl}/layout/update-widget/widgetId`, [
  ValidationMiddleware.validJWTNeeded,
  layoutWidgets.updateWidget
])


module.exports = app
module.exports.handler = serverless(app)

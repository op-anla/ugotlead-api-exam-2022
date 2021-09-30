"use strict";
// Used services
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
var cors = require("cors");
const http = require("http");

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
const layoutWidgets = require("../App/Controllers/layout-widgets.controller.js");
const user = require("../App/Controllers/user.controller.js");
const entry = require("../App/Controllers/entry.controller.js");
const mailchimpController = require("../App/Controllers/mailchimpController.controller.js");
const AuthorizationController = require("../App/auth/controllers/authorization.controller.js");
const email = require("../App/Controllers/email.controller.js");
const standard_layout = require("../App/Controllers/standard_layout.controller.js");
const standard_layout_comp = require("../App/Controllers/standard_layout_comp.controller.js");
const GoogleAuth = require("../App/Controllers/GoogleAuth.controller.js");

const analytics = require("../App/Controllers/analytics.controller.js");

// Middleware
const VerifyUserMiddleware = require("../App/auth/middleware/verify.user.middleware");
const RedeemValidation = require("../App/common/middleware/redeem.validation.middleware");
const ValidationMiddleware = require("../App/common/middleware/auth.validation.middleware");
const RequestValidation = require("../App/common/middleware/request.validation.middleware");
// App uses

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", router);
// Router
router.get("/", (req, res) => {
  res.write("<h1>Server is up and running! Make your requests</h1>");
  res.end();
});
/* 
Version: 1.0
*/
const version = "v1";
const apiUrl = `${version}/api`;
/* 
Routing docs
https://expressjs.com/en/guide/routing.html
*/
/* 
-----------------------------------------------
CAMPAIGNS
-----------------------------------------------
*/
router.get(`/${apiUrl}/campaigns`, [
  ValidationMiddleware.validJWTNeeded,
  campaigns.findAll,
]);
router.get(`/${apiUrl}/campaigns/:campaignId`, [campaigns.findOne]);
router.get(`/${apiUrl}/campaign-stats/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  campaigns.findStatsForCampaign,
]);
router.post(`/${apiUrl}/create-campaign`, [
  ValidationMiddleware.validJWTNeeded,
  campaigns.create,
]);
router.put(`/${apiUrl}/update-campaign/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  campaigns.update,
]);
router.delete(`/${apiUrl}/delete-campaign/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  campaigns.delete,
]);
/* 
-----------------------------------------------
LAYOUT FOR CAMPAIGNS
EXTENDED CAMPAIGN
-----------------------------------------------
*/
router.get(`/${apiUrl}/layout/campaign/:campaignId`, [
  layout.findLayoutForSpecificCampaign,
]);
router.post(`/${apiUrl}/layout/:campaignId/create-comp`, [
  ValidationMiddleware.validJWTNeeded,
  layout.createNewComponentForCampaign,
]);
router.put(`/${apiUrl}/update-layout/campaign/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  layout.updateLayoutForSpecificCampaign,
]);
router.delete(`/${apiUrl}/delete-layout/campaign/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  layout.removeWidgetFromCampaign,
]);
/* 
-----------------------------------------------
COMPANIES
-----------------------------------------------
*/
router.post(`/${apiUrl}/create-company`, [
  ValidationMiddleware.validJWTNeeded,
  companies.create,
]);
router.get(`/${apiUrl}/companies`, [
  ValidationMiddleware.validJWTNeeded,
  companies.findAll,
]);
router.get(`/${apiUrl}/companies/:companyId`, [
  ValidationMiddleware.validJWTNeeded,
  companies.findOneCompany,
]);
router.put(`/${apiUrl}/update-company/:companyId`, [
  ValidationMiddleware.validJWTNeeded,
  companies.update,
]);
router.delete(`/${apiUrl}/company/:companyId`, [
  ValidationMiddleware.validJWTNeeded,
  companies.delete,
]);
/* 
-----------------------------------------------
USERS
-----------------------------------------------
*/
router.post(`/${apiUrl}/user`, [
  ValidationMiddleware.validJWTNeeded,
  user.create,
]);
router.get(`/${apiUrl}/user/:userId`, [
  ValidationMiddleware.validJWTNeeded,
  user.getById,
]);
router.get(`/${apiUrl}/user`, [
  ValidationMiddleware.validJWTNeeded,
  user.getByToken,
]);
router.put(`/${apiUrl}/user/:userId`, [
  ValidationMiddleware.validJWTNeeded,
  user.putById,
]);
router.get(`/${apiUrl}/users`, [
  ValidationMiddleware.validJWTNeeded,
  user.getAll,
]);
router.delete(`/${apiUrl}/user/:userId`, [
  ValidationMiddleware.validJWTNeeded,
  user.deleteUser,
]);
/* 
-----------------------------------------------
AUTH
Extending the USER part - This is Auth with internal JWT Login
-----------------------------------------------
*/
router.post(`/${apiUrl}/auth`, [
  VerifyUserMiddleware.hasAuthValidFields,
  VerifyUserMiddleware.isPasswordAndUserMatch,
  AuthorizationController.login,
]);
// router.post(`/${apiUrl}/google/auth`, [GoogleAuth.login]);
// router.get(`/${apiUrl}/google/user`, [GoogleAuth.checkUser]);
/* 
-----------------------------------------------
MAILCHIMP 
This is actually extending the Campaign because each campaign will have auth endpoints for mailchimp
The Maillchimp info will also be saved for that specific campaign and not on the specific user. 
-----------------------------------------------
*/

router.get(`/${apiUrl}/auth/mailchimp`, [mailchimpController.redirectToLogin]);

router.get(`/${apiUrl}/auth/mailchimp/login`, [
  ValidationMiddleware.validJWTNeeded,
  mailchimpController.updateCampaignWithMailchimpInfo,
]);
router.get(`/${apiUrl}/getlists`, [
  ValidationMiddleware.validJWTNeeded,
  mailchimpController.getAudienceLists,
]);
router.post(`/${apiUrl}/addmember`, [mailchimpController.addMemberToMailchimp]);
/* 
-----------------------------------------------
REWARDS 
-----------------------------------------------
*/
router.get(`/${apiUrl}/rewards/:campaignId`, [rewards.findRewardsByCampaignId]);
router.get(`/${apiUrl}/rewards-meta/:rewardId`, [
  ValidationMiddleware.validJWTNeeded,
  reward_meta.findRewardMetaForReward,
]);
router.post(`/${apiUrl}/create-reward`, [
  ValidationMiddleware.validJWTNeeded,
  rewards.create,
  reward_meta.create,
]);
router.put(`/${apiUrl}/update-reward/:reward_id`, [
  ValidationMiddleware.validJWTNeeded,
  rewards.updateById,
  reward_meta.updateById,
]);

router.delete(`/${apiUrl}/delete-reward/:reward_id`, [
  ValidationMiddleware.validJWTNeeded,
  reward_meta.deleteById,
  rewards.deleteById,
]);

/* 
-----------------------------------------------
LOGGGING 
-----------------------------------------------
*/
router.get(`/${apiUrl}/checklogging/:campaignId`, [
  RequestValidation.validateDomain,
  logging.findLogForUser,
  entry.findEntryFromLog,
]);
router.post(`/${apiUrl}/create-logging/:campaignId`, [
  RequestValidation.validateDomain,
  logging.createLogForUser,
]);
/* 
-----------------------------------------------
REWARD AND REDEEM 
-----------------------------------------------
*/
router.post(`/${apiUrl}/checkreward/:campaignId`, [
  RequestValidation.validateDomain,
  rewards.getAllRewardsForRedeem,
  RedeemValidation.didUserWin,
  entry.createEntry,
  reward_meta.findRewardMetaForRewardInRedeemFlow,
  rewards.updateClaim,
]);
/* 
-----------------------------------------------
LAYOUT AND WIDGETS
-----------------------------------------------
*/
router.post(`/${apiUrl}/layout/create-widget`, [
  ValidationMiddleware.validJWTNeeded,
  layoutWidgets.createwidget,
]);
router.put(`/${apiUrl}/layout/update-widget/:widgetId`, [
  ValidationMiddleware.validJWTNeeded,
  layoutWidgets.updateWidget,
]);
router.get(`/${apiUrl}/layout/widgets`, [
  ValidationMiddleware.validJWTNeeded,
  layoutWidgets.findAllWidgets,
]);
router.delete(`/${apiUrl}/layout/delete-widget/:widgetId`, [
  ValidationMiddleware.validJWTNeeded,
  layoutWidgets.deleteSelectedWidget,
]);
/* 
-----------------------------------------------
STANDARD LAYOUT
-----------------------------------------------
*/
router.post(`/${apiUrl}/standard-layout/create-layout`, [
  ValidationMiddleware.validJWTNeeded,
  standard_layout.createStandardLayout,
]);
router.get(`/${apiUrl}/standard-layout/getall`, [
  ValidationMiddleware.validJWTNeeded,
  standard_layout.getAllStandardLayouts,
]);

router.put(`/${apiUrl}/update-layout/:standard_layout_id`, [
  ValidationMiddleware.validJWTNeeded,
  standard_layout.updateStandardLayout,
]);

/* 
-----------------------------------------------
STANDARD LAYOUT COMPS
-----------------------------------------------
*/
router.post(`/${apiUrl}/standard-layout-comps/create-comp/:standardLayoutId`, [
  ValidationMiddleware.validJWTNeeded,
  standard_layout_comp.createStandardLayoutComponent,
]);
router.get(`/${apiUrl}/standard-layout-comps/getcomps/:standardLayoutId`, [
  ValidationMiddleware.validJWTNeeded,
  standard_layout_comp.getAllStandardLayoutComponentsFromLayoutId,
]);
router.put(
  `/${apiUrl}/standard-layout-comps/update-layout-comp/:standardLayoutCompId`,
  [
    ValidationMiddleware.validJWTNeeded,
    standard_layout_comp.updateStandardLayoutComponent,
  ]
);
router.delete(
  `/${apiUrl}/standard-layout-comps/delete-layout-comp/:standardLayoutCompId`,
  [
    ValidationMiddleware.validJWTNeeded,
    standard_layout_comp.deleteStandardLayoutWidget,
  ]
);
/* 
-----------------------------------------------
Emails
-----------------------------------------------
*/
router.get(`/${apiUrl}/email/get-email-for-campaign/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  email.getEmailInfoForCampaign,
]);
router.post(`/${apiUrl}/email/sendtest`, [
  ValidationMiddleware.validJWTNeeded,
  email.sendTest,
]);
router.post(`/${apiUrl}/email/send-mail-for-completing-game`, [
  email.sendUserEmailForPlaying,
]);
router.post(`/${apiUrl}/email/create-mail`, [
  ValidationMiddleware.validJWTNeeded,
  email.createMail,
]);
router.post(`/${apiUrl}/email/update-mail`, [
  ValidationMiddleware.validJWTNeeded,
  email.updateMail,
]);
/* 
-----------------------------------------------
Cache
-----------------------------------------------
*/
router.get(`/${apiUrl}/cache/flushall`, [
  ValidationMiddleware.validJWTNeeded,
  campaigns.flushAllCache,
]);
/* 
-----------------------------------------------
Analytics
-----------------------------------------------
*/
router.get(`/${apiUrl}/analytics/get-all-visitors`, [analytics.getAllVisitors]);
router.get(`/${apiUrl}/analytics/get-all-leads`, [analytics.getAllLeads]);
router.get(`/${apiUrl}/analytics/count-players`, [analytics.getCountPlayers]);
router.get(`/${apiUrl}/analytics/get-all-rewards`, [analytics.getAllRewards]);
router.get(`/${apiUrl}/analytics/get-all-campaigns`, [
  analytics.getAllCampaigns,
]);
router.get(`/${apiUrl}/analytics/count-campaigns`, [
  analytics.getCountCampaigns,
]);
router.get(`/${apiUrl}/analytics/get-all-companies`, [
  analytics.getAllCompanies,
]);
router.get(`/${apiUrl}/analytics/count-companies`, [
  analytics.getCountCompanies,
]);
router.get(`/${apiUrl}/analytics/top5`, [analytics.getTop5]);
/* 
-----------------------------------------------
Create the server and export the app 
-----------------------------------------------
*/
const server = http.createServer(app);
const pid = process.pid;
server.listen(process.env.PORT, () => {
  console.log("Listening on: ", process.env.PORT);
  console.log(`Started process ${pid}`);
});
module.exports = app;

"use strict";
// Used services
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const cors = require("cors");
const http = require("http");
require("dotenv").config();
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
const player = require("../App/Controllers/player.controller.js");
const mailchimpController = require("../App/Controllers/mailchimpController.controller.js");
const heyLoyaltyController = require("../App/Controllers/heyLoyaltyController.controller.js");
const AuthorizationController = require("../App/auth/controllers/authorization.controller.js");
const email = require("../App/Controllers/email.controller.js");
const standard_layout = require("../App/Controllers/standard_layout.controller.js");
const standard_layout_comp = require("../App/Controllers/standard_layout_comp.controller.js");
const campaign_meta_data = require("../App/Controllers/campaign_meta_data.controller.js");
// const GoogleAuth = require("../App/Controllers/GoogleAuth.controller.js");

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
// Setup the Express global error handler.
app.use(function (error, request, response, next) {
  console.log(error);

  // Because we hooking post-response processing into the global error handler, we
  // get to leverage unified logging and error handling; but, it means the response
  // may have already been committed, since we don't know if the error was thrown
  // PRE or POST response. As such, we have to check to see if the response has
  // been committed before we attempt to send anything to the user.
  if (!response.headersSent) {
    response
      .status(500)
      .send("Sorry - something went wrong. We're digging into it.");
  }
});
// Router
router.get("/test", (req, res) => {
  res.write(
    "<h1>Server is up and running! Make your requests <br> Ugotlead team</h1>"
  );
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
router.get(`/${apiUrl}/get-all-entrydata/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  entry.findAllEntriesForCampaign,
  player.getAllPlayersByAllEntries,
  logging.getLoggingInfoByEntryData,
  rewards.getRewardInfoByEntryData,
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
CAMPAIGN META DATA
EXTENDED CAMPAIGN
-----------------------------------------------
*/
router.post(`/${apiUrl}/create-campaign-meta/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  campaign_meta_data.createCampaignMetaData,
]);
router.get(`/${apiUrl}/get_campaign_meta_data/:campaignId`, [
  campaign_meta_data.findMetaForCampaignId,
]);

router.put(`/${apiUrl}/update-campaign-meta/:campaignId`, [
  ValidationMiddleware.validJWTNeeded,
  campaign_meta_data.update,
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
router.get(`/${apiUrl}/companies/:companyId`, [companies.findOneCompany]);
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
/* 
-----------------------------------------------
HeyLoyalty 
This is actually extending the Campaign because each campaign will have auth endpoints for heyloyalty
The heyLoyalty info will also be saved for that specific campaign and not on the specific user. 
-----------------------------------------------
*/
router.get(`/${apiUrl}/auth/heyloyalty/check-status`, [
  ValidationMiddleware.validJWTNeeded,
  heyLoyaltyController.checkKeyStatus,
]);
router.get(`/${apiUrl}/auth/heyloyalty/get-list`, [
  ValidationMiddleware.validJWTNeeded,
  heyLoyaltyController.getList,
]);
router.post(`/${apiUrl}/auth/heyloyalty/save-keys`, [
  ValidationMiddleware.validJWTNeeded,
  heyLoyaltyController.saveKeysForCampaign,
]);
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
LOGGING 
-----------------------------------------------
*/
router.get(`/${apiUrl}/checklogging/:campaignId/:session_id`, [
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
  campaigns.addUserToIntegrations,
  player.createPlayer,
  RedeemValidation.didUserWin,
  entry.createEntry,
  reward_meta.findRewardMetaForRewardUsingMiddleware,
  rewards.updateClaim,
]);
router.post(`/${apiUrl}/checkreward-justgame/:campaignId`, [
  RequestValidation.validateDomain,
  rewards.getAllRewardsForRedeem,
  campaigns.addUserToIntegrations,
  RedeemValidation.didUserWinWithResponse,
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
  RequestValidation.validateDomain,
  reward_meta.findRewardMetaForRewardUsingMiddleware,
  email.sendEmailToOperators,
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
Control
-----------------------------------------------
*/
router.get(`/${apiUrl}/control/bearer-validation`, [
  ValidationMiddleware.validJWTSimple,
]);

/* 
-----------------------------------------------
Analytics
-----------------------------------------------
*/
router.get(`/${apiUrl}/analytics/get-all-visitors`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getAllVisitors,
]);
router.get(`/${apiUrl}/analytics/get-all-leads`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getAllLeads,
]);
router.get(`/${apiUrl}/analytics/count-players`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getCountPlayers,
]);
router.get(`/${apiUrl}/analytics/get-all-rewards`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getAllRewards,
]);
router.get(`/${apiUrl}/analytics/get-all-campaigns`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getAllCampaigns,
]);
router.get(`/${apiUrl}/analytics/count-campaigns`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getCountCampaigns,
]);
router.get(`/${apiUrl}/analytics/get-all-companies`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getAllCompanies,
]);
router.get(`/${apiUrl}/analytics/count-companies`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getCountCompanies,
]);
router.get(`/${apiUrl}/analytics/top5`, [
  ValidationMiddleware.validJWTNeeded,
  analytics.getTop5,
]);

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

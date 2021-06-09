"use strict"
// Used services
const express = require("express")
const serverless = require("serverless-http")
const app = express()
const bodyParser = require("body-parser")
const router = express.Router()
var cors = require('cors')
// Controller
const campaigns = require("../App/Controllers/campaign.controller.js");
const companies = require("../App/Controllers/companies.controller.js");
const user = require("../App/Controllers/user.controller.js");
const AuthorizationController = require("../App/Controllers/authorization.controller.js");
// Middleware
const VerifyUserMiddleware = require('../App/auth/middleware/verify.user.middleware')
// App uses
app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(bodyParser.json())
app.use("/.netlify/functions/server", router) // path must route to lambda
app.use("/", router)
// Router
router.get("/", (req, res) => {
  res.write("<h1>Server is up and running! Make your requests</h1>")
  res.end()
})
// CAMPAIGNS
router.get("/campaigns", (req, res) => {
  console.log("Testing /campaigns");
  campaigns.findAll(req, res);
})
router.get("/campaigns/:campaignId", (req, res) => {
  console.log("Testing individual campaign");
  campaigns.findOne(req, res);
})
router.post('/create-campaign', (req, res) => {
  campaigns.create(req, res);
});
router.put('/update-campaign/:campaignId', (req, res) => {
  campaigns.update(req, res);
});
router.delete('/delete-campaign/:campaignId', (req, res) => {
  campaigns.delete(req, res);
});
// COMPANIES
router.post('/create-company', (req, res) => {
  companies.create(req, res);
});
// Users
/* 
USERS:
These are all the user endpoints
*/
router.post('/user', (req, res) => {
  user.create(req, res)
})
router.get('/user/:userId', (req, res) => {
  user.getById(req, res)
})
router.put('/user/:userId', (req, res) => {
  user.putById(req, res)
})
router.get('/users', (req, res) => {
  user.getAll(req, res);
})
router.delete('/user/:userId', (req, res) => {
  user.deleteUser(req, res)
})
/* 
Auth endpoints:
We use a JWT based login system - These endpoints are required for the app to work
*/
router.post('/auth', [
  VerifyUserMiddleware.hasAuthValidFields,
  VerifyUserMiddleware.isPasswordAndUserMatch,
  AuthorizationController.login

])

module.exports = app
module.exports.handler = serverless(app)

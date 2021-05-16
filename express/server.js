"use strict"
// Used services
const express = require("express")
const serverless = require("serverless-http")
const app = express()
const bodyParser = require("body-parser")
const router = express.Router()
var cors = require('cors')
// Controller
const templates = require("../App/Controllers/template.controller.js");
// App uses
app.use(cors({
  origin: 'https://localhost:3000'
}))
app.use(bodyParser.json())
app.use("/.netlify/functions/server", router) // path must route to lambda
app.use("/", router)
// Router
router.get("/", (req, res) => {
  res.write("<h1>Server is up and running! Make your requests</h1>")
  res.end()
})
router.get("/templates", (req, res) => {
  console.log("Testing /templates");
  templates.findAll(req, res);
})
router.get("/templates/:templateId", (req, res) => {
  console.log("Testing /templates");
  templates.findOne(req, res);
})
router.post('/create-template', (req, res) => {
  templates.create(req, res);
});
router.put('/update-template/:templateId', (req, res) => {
  templates.update(req, res);
});
router.delete('/delete-template/:templateId', (req, res) => {
  templates.delete(req, res);
});
module.exports = app
module.exports.handler = serverless(app)

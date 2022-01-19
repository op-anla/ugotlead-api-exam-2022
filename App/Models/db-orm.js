require("dotenv").config();
// const mysql = require("mysql");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 6,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
// Models
db.campaigns = require("./campaign.model.orm.js")(sequelize, Sequelize);
// Sync the database to our models.
// Basically do nothing if the models exists and create if it doesn't exist
db.sequelize.sync();
module.exports = db;

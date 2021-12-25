module.exports = (sequelize, Sequelize) => {
  const campaigns = sequelize.define(
    "campaigns",
    {
      campaign_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically gets converted to SERIAL for postgres
      },
      company_id: {
        type: Sequelize.INTEGER,
      },
      campaign_name: {
        type: Sequelize.STRING(45),
      },
      campaign_owner_id: {
        type: Sequelize.INTEGER,
      },
      campaign_startdate: {
        type: Sequelize.TIME,
      },
      campaign_enddate: {
        type: Sequelize.TIME,
      },
      campaign_description: {
        type: Sequelize.STRING(5000),
      },
      restrict_access_interval: {
        type: Sequelize.STRING,
      },
      campaign_integrations: {
        type: Sequelize.STRING(5000),
      },
      background_image_url: {
        type: Sequelize.STRING(145),
      },
      brush_image_url: {
        type: Sequelize.STRING(145),
      },
      primary_color: {
        type: Sequelize.STRING(45),
      },
      leads_goal: {
        type: Sequelize.INTEGER,
      },
      campaign_logo_url: {
        type: Sequelize.STRING,
      },
    },
    { tableName: "campaigns", timestamps: false }
  );

  return campaigns;
};

// Campaign.getAllCampaigns = (result) => {
//   sql.query("SELECT * FROM campaigns", async (err, res) => {
//     if (err) {
//       console.log(
//         "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
//         err
//       );
//       result(err, null);
//       return;
//     }
//     result(null, res);
//   });
// };

// Campaign.countAll = (result) => {
//   sql.query("SELECT COUNT(*) AS campaigns FROM campaigns", async (err, res) => {
//     if (err) {
//       console.log(
//         "🚀 ~ file: campaign.model.js ~ line 101 ~ sql.query ~ err",
//         err
//       );
//       result(err, null);
//       return;
//     }
//     result(null, res);
//   });
// };
// module.exports = Campaign;

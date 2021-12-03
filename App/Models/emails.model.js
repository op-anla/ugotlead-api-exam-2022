const sql = require("./db.js");

// const checkJson = require("../common/helpers/checkmyjson");
// constructor
const EmailModel = function (email) {
  this.campaign_id = email.campaign_id;
  this.email_logo_url = email.email_logo_url;
  this.email_win_text = email.email_win_text;
  this.email_consolation_text = email.email_consolation_text;
  this.email_custom_css = email.email_custom_css;
  this.email_admin_text = email.email_admin_text;
};
EmailModel.create = (newEmail, result) => {
  sql.query("INSERT INTO campaign_emails SET ?", newEmail, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    console.log("created email: ", {
      id: res.insertId,
      // Spread operator to extend the object with data
      ...newEmail,
    });

    result(null, {
      id: res.insertId,
      ...newEmail,
    });
  });
};
EmailModel.findById = (campaignId, result) => {
  sql.query(
    `SELECT * FROM campaign_emails WHERE campaign_id = ?`,
    campaignId,
    (err, res) => {
      if (err) {
        console.log("err", err);

        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found email: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found layout with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
    }
  );
};
EmailModel.updateById = (id, email, result) => {
  console.log("id, email", id, email);
  sql.query(
    "UPDATE campaign_emails SET  ?   WHERE campaign_id = ?",
    [email, id],
    (err, res) => {
      if (err) {
        console.log("err", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found campaign with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }

      console.log("updated campaign: ", {
        id: id,
        ...email,
      });
      result(null, {
        id: id,
        ...email,
      });
    }
  );
};
module.exports = EmailModel;

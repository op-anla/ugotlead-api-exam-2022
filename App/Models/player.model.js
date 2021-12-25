const sql = require("./db.js");

// constructor
const Player = function (player) {
  this.player_name = player.player_name;
  this.player_email = player.player_email;
  this.campaign_id = player.campaign_id;
};

Player.create = (newPlayer, result) => {
  sql.query("INSERT INTO players SET ?", newPlayer, (err, res) => {
    if (err) {
      console.log(
        "🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err",
        err
      );
      result(err, null);
      return;
    }

    console.log("created player", { id: res.insertId, ...newPlayer });

    result(null, {
      id: res.insertId,
      ...newPlayer,
    });
  });
};
Player.checkIfUserHasPlayedOnThisCampaing = (payload, result) => {
  sql.query(
    "SELECT * FROM players where campaign_id = ? AND player_name = ? AND player_email = ?",
    [payload.campaignId, payload.userInfo.navn, payload.userInfo.email],
    (err, res) => {
      if (err) {
        console.log("err in finding player", err);

        result(err, null);
        return;
      }
      console.log("RES?", res);
      if (res.length == 0) {
        // Couldn't find user
        console.log("Continue in flow because no player was found", res);
        result(null, res[0]);
      } else {
        result("Don't allow user to play again", null);
      }
      // Here we have the correct response
    }
  );
};
Player.getPlayerById = (player_id, result) => {
  console.log("trying to get all entries in models from cmapaign id");
  sql.query(
    "SELECT * FROM players where player_id = ?",
    player_id,
    (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: entry.model.js ~ line 17 ~ sql.query ~ err",
          err
        );
        result(err, null);
        return;
      }
      // Here we have the correct response
      result(null, res[0]);
    }
  );
};
module.exports = Player;

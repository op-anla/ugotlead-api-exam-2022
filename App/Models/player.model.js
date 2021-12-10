const sql = require("./db.js");

// constructor
const Player = function (player) {
  this.player_name = player.player_name;
  this.player_email = player.player_email;
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

    console.log("created player");

    result(null, {
      id: res.insertId,
      ...newPlayer,
    });
  });
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
        result(null, err);
        return;
      }
      // Here we have the correct response
      result(null, res[0]);
    }
  );
};
module.exports = Player;

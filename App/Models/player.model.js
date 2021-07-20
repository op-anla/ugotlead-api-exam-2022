const sql = require("./db.js");

// constructor
const Player = function (player) {
  this.player_name = player.player_name;
  this.player_email = player.player_email;
};

Player.create = (newPlayer, result) => {
  sql.query("INSERT INTO players SET ?", newPlayer, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: campaign.model.js ~ line 13 ~ sql.query ~ err", err)
      result(err, null);
      return;
    }

    console.log("created player: ", {
      id: res.insertId,
      ...newPlayer
    });

    result(null, {
      id: res.insertId,
      ...newPlayer
    });

  });
};
module.exports = Player;

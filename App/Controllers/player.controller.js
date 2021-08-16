const Player = require("../Models/player.model");

/* 
-----------------------------------------------
PLAYER
-----------------------------------------------
*/

exports.createPlayer = (req, res) => {
  console.log(
    "🚀 ~ file: campaign.controller.js ~ line 5 ~ reqs CREATE PLAYER",
    req.body
  );
  // Create a player
  const newPlayer = new Player({
    player_name: req.body.currentUser.navn,
    player_email: req.body.currentUser.email,
  });

  // Save player in the database
  Player.create(newPlayer, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the player.",
      });
    else {
      console.log("DATA IN LOG", data);
      res.status(201).send(data);
    }
  });
};

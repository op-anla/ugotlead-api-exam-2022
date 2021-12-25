const PlayerModel = require("../Models/player.model");

/* 
-----------------------------------------------
PLAYER
-----------------------------------------------
*/
exports.checkPlayerParticipation = (req, res, next) => {
  // Check if player already played
  /* 
  First endpoint in checkreward 
  Basic endpoint validation 
  */
  if (!req.body) {
    return res.status(500).send();
  }
  if (!req.body.userInfo.navn && !req.body.userInfo.email) {
    return res.status(500).send();
  }
  let payload = {
    userInfo: req.body.userInfo,
    campaignId: req.params.campaignId,
  };
  PlayerModel.checkIfUserHasPlayedOnThisCampaing(payload, (err, data) => {
    if (err) {
      return res.status(403).send("You may not participate again...");
    }
    console.log(
      "User did not participate and we allow them to continue",
      err,
      data
    );
    return next();
  });
};
exports.createPlayer = (req, res, next) => {
  // Create a player
  const newPlayer = new PlayerModel({
    player_name: req.body.userInfo.navn,
    player_email: req.body.userInfo.email,
    campaign_id: Number(req.params.campaignId),
  });

  // Save player in the database
  PlayerModel.create(newPlayer, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the player.",
      });
    } else {
      res.locals.playerData = data;
      next();
    }
  });
};
// Retrieve all players from entry
exports.getAllPlayersByAllEntries = (req, res, next) => {
  let entries = res.locals.entries;
  if (entries.length) {
    // Array with stuff
    let itemsProcessed = 0;
    function afterForeach() {
      // After foreach
      return next();
    }
    entries.forEach((entry, index, array) => {
      PlayerModel.getPlayerById(entry.player_id, (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving player.",
          });
        } else {
          // Success
          itemsProcessed++;
          entries[index].playerData = data;
          if (itemsProcessed === array.length) {
            afterForeach();
          }
        }
      });
    });
  } else {
    //  Empty array
    res.status(400).send();
  }
};

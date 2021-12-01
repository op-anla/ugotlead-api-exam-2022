const Player = require("../Models/player.model");

/* 
-----------------------------------------------
PLAYER
-----------------------------------------------
*/

exports.createPlayer = (req, res, next) => {
  // Create a player
  const newPlayer = new Player({
    player_name: req.body.userInfo.navn,
    player_email: req.body.userInfo.email,
  });

  // Save player in the database
  Player.create(newPlayer, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the player.",
      });
    } else {
      console.log("DATA IN LOG", data);
      next();
    }
  });
};
// Retrieve all players from entry
exports.getAllPlayersByAllEntries = (req, res, next) => {
  console.log("In players and entries", res.locals.entries);
  let entries = res.locals.entries;
  if (entries.length) {
    // Array with stuff
    let itemsProcessed = 0;
    function afterForeach() {
      // After foreach
      console.log("After foreach", entries[0]);
      return next();
    }
    entries.forEach((entry, index, array) => {
      Player.getPlayerById(entry.player_id, (err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving campaigns.",
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

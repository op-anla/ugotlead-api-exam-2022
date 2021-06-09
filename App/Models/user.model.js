const sql = require("./db.js");

// constructor
const User = function (user) {
  this.username = user.username;
  this.password = user.password;
};
User.create = (newUser, result) => {
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created  user: ", {
      id: res.insertId,
      ...newUser
    });
    result(null, {
      id: res.insertId,
      ...newUser
    });
  });
};
User.findById = (userId, result) => {
  sql.query(`SELECT * FROM user WHERE iduser = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(res[0].password);
    /* 
    Here we validate the response so the client will never get the hashed password. 
    Even if the password is hashed they should NEVER be able to see it.
    */
    const validatedUser = {
      iduser: res[0].iduser,
      username: res[0].username
    }
    if (res.length) {
      console.log("found user: ", validatedUser);
      result(null, validatedUser);
      return;
    }

    // not found User with the id
    result({
      kind: "not_found"
    }, null);
  });
};
User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE user SET username = ? WHERE iduser = ?",
    [user.username, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found user with the id
        result({
          kind: "not_found"
        }, null);
        return;
      }

      console.log("updated user: ", {
        id: id,
        ...user
      });
      result(null, {
        id: id,
        ...user
      });
    }
  );
};
module.exports = User;

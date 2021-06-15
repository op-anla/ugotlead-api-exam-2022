const sql = require("./db.js");

// constructor
const User = function (user) {
  this.username = user.username;
  this.password = user.password;
};
User.create = (newUser, result) => {
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: user.model.js ~ line 11 ~ sql.query ~ err", err)
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
User.findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM user WHERE username = "${username}"`, (err, res) => {
      if (err) {
        console.log("🚀 ~ file: user.model.js ~ line 30 ~ sql.query ~ err", err)
        return reject(err);
      }
      if (res.length) {
        //   result(null, validatedUser);
        return resolve(res[0]);
      }


    });
  });


}

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM user WHERE iduser = ${userId}`, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: user.model.js ~ line 48 ~ sql.query ~ err", err)
      result(err, null);
      return;
    }
    console.log(res[0].password);
    /* 
    Here we validate the response so the client will never get the hashed password. 
    Even if the password is hashed they should NEVER be able to see it.
    */
    const validatedUser = {
      user: {

        iduser: res[0].iduser,
        username: res[0].username
      }
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
    "UPDATE user SET username = ?,password = ? WHERE iduser = ?",
    [user.username, user.password, id],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: user.model.js ~ line 82 ~ err", err)
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
      /* 
      Here we validate the response the client will receive.
      We will remove the password from the response
      */
      const validatedUser = {
        username: user.username
      }
      console.log("updated user: ", {
        id: id,
        ...validatedUser
      });
      result(null, {
        id: id,
        ...validatedUser
      });
    }
  );
};
// Get all
User.getAll = result => {
  sql.query("SELECT * FROM user", async (err, res) => {
    if (err) {
      console.log("🚀 ~ file: user.model.js ~ line 116 ~ sql.query ~ err", err)
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};
// Delete user
User.remove = (id, result) => {
  sql.query("DELETE FROM user WHERE iduser = ?", id, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: user.model.js ~ line 129 ~ sql.query ~ err", err)
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({
        kind: "not_found"
      }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};
module.exports = User;

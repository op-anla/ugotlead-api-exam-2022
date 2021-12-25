const sql = require("./db.js");

// constructor
const User = function (user) {
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
};
User.create = (newUser, result) => {
  sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: user.model.js ~ line 11 ~ sql.query ~ err", err);
      result(err, null);
      return;
    }

    console.log("created  user: ", {
      id: res.insertId,
      ...newUser,
    });
    result(null, {
      id: res.insertId,
      ...newUser,
    });
  });
};
User.findByUsername = (username) => {
  /* 
  This functions is being called from verify.user.middleware and will find the specific user with that username
  It will return the whole user response which will contain the password
  */
  return new Promise((resolve, reject) => {
    console.log("Inside promise in findbyusername");
    sql.query(`SELECT * FROM user WHERE username = ?`, username, (err, res) => {
      if (err) {
        console.log(
          "🚀 ~ file: user.model.js ~ line 30 ~ sql.query ~ err",
          err
        );
        return reject(err);
      }
      if (res.length) {
        //   result(null, validatedUser);

        console.log(
          "🚀 ~ file: user.model.js ~ line 48 ~ returnnewPromise ~ res[0]",
          res[0]
        );
        return resolve(res[0]);
      } else {
        console.log("No error but user is not found", res);
        return reject();
      }
    });
  });
};
User.findByUsernameAndEmail = (username, email) => {
  /* 
  This functions is being called from verify.user.middleware and will find the specific user with that username
  It will return the whole user response which will contain the password
  */
  return new Promise((resolve, reject) => {
    console.log("Inside promise in findbyusername", username, email);
    sql.query(
      `SELECT * FROM user WHERE username = ? AND email = ?`,
      [username, email],
      (err, res) => {
        if (err) {
          return reject(err);
        }
        if (res.length > 0) {
          //   result(null, validatedUser);

          console.log(
            "🚀 ~ file: user.model.js ~ line 48 ~ returnnewPromise ~ res[0]",
            res[0]
          );
          return resolve(res[0]);
        } else {
          return resolve({});
        }
      }
    );
  });
};
User.findById = (userId, result) => {
  sql.query(`SELECT * FROM user WHERE user_id = ?`, userId, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: user.model.js ~ line 48 ~ sql.query ~ err", err);
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
        user_id: res[0].user_id,
        username: res[0].username,
      },
    };
    if (res.length) {
      console.log("found user: ", validatedUser);
      result(null, validatedUser);
      return;
    }

    // not found User with the id
    result(
      {
        kind: "not_found",
      },
      null
    );
  });
};
User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE user SET username = ?,password = ? WHERE user_id = ?",
    [user.username, user.password, id],
    (err, res) => {
      if (err) {
        console.log("🚀 ~ file: user.model.js ~ line 82 ~ err", err.code);
        if (err.code === "ER_DUP_ENTRY") {
          result(
            {
              kind: "duplicate_entry",
              message: err.sqlMessage,
            },
            null
          );
          return;
        } else {
          result(err, null);
          return;
        }
      }

      if (res.affectedRows == 0) {
        // not found user with the id
        result(
          {
            kind: "not_found",
          },
          null
        );
        return;
      }
      /* 
      Here we validate the response the client will receive.
      We will remove the password from the response
      */
      const validatedUser = {
        username: user.username,
      };
      console.log("updated user: ", {
        id: id,
        ...validatedUser,
      });
      result(null, {
        id: id,
        ...validatedUser,
      });
    }
  );
};
// Get all
User.getAll = (result) => {
  sql.query("SELECT * FROM user", async (err, res) => {
    if (err) {
      console.log("🚀 ~ file: user.model.js ~ line 116 ~ sql.query ~ err", err);
      result(err, nul);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};
// Delete user
User.remove = (id, result) => {
  sql.query("DELETE FROM user WHERE user_id = ?", id, (err, res) => {
    if (err) {
      console.log("🚀 ~ file: user.model.js ~ line 129 ~ sql.query ~ err", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};
module.exports = User;

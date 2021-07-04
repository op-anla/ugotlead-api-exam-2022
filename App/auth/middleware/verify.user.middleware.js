const UserModel = require('../../Models/user.model');
const crypto = require('crypto');

exports.hasAuthValidFields = (req, res, next) => {
  /* 
  This function will validate the request and make sure it has the correct fields. 
  There should already be client validation before this happens. 
  */
  let errors = [];
  /* 
  Very short verify of the request
  */
  if (req.body) {
    if (!req.body.username) {
      errors.push('Missing username field');
    }
    if (!req.body.password) {
      errors.push('Missing password field');
    }

    if (errors.length) {
      return res.status(400).send({
        errors: errors.join(',')
      });
    } else {
      /* 
      Calling the next function
      */
      return next();
    }
  } else {
    return res.status(400).send({
      errors: 'Missing username and password fields'
    });
  }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
  /* 
  This will check if the username and password that the request contains is in the database
  */
  UserModel.findByUsername(req.body.username)
    .then((user) => {
      console.log("User", req.body)
      if (!user) {
        res.status(404).send({});
      } else {
        let passwordFields = user.password.split('$');
        let salt = passwordFields[0];
        /* 
        Here we basically try to replicate the hash in the database to match with the one in the DB.
        This will always be the same if the password is correct and if not -> FAIL
        */
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");

        if (hash === passwordFields[1]) {
          console.log("SUCCESS")
          req.body = {
            userId: user.iduser,
            userName: user.username,
          };
          // Go next function
          return next();
        } else {
          return res.status(400).send({
            errors: ['Invalid username or password']
          });
        }
      }
    });
};

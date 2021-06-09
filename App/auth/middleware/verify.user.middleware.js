const UserModel = require('../../Models/user.model');
const crypto = require('crypto');

exports.hasAuthValidFields = (req, res, next) => {
  let errors = [];

  if (req.body) {
    if (!req.body.username) {
      errors.push('Missing email field');
    }
    if (!req.body.password) {
      errors.push('Missing password field');
    }

    if (errors.length) {
      return res.status(400).send({
        errors: errors.join(',')
      });
    } else {
      return next();
    }
  } else {
    return res.status(400).send({
      errors: 'Missing email and password fields'
    });
  }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
  UserModel.findByUsername(req.body.username)
    .then((user) => {
      if (!user) {
        res.status(404).send({});
      } else {
        console.log(user);
        let passwordFields = user.password.split('$');
        console.log("fields", passwordFields)
        let salt = passwordFields[0];
        console.log("salt", salt)
        console.log("body", req.body)
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");


        console.log("hash", hash)
        if (hash === passwordFields[1]) {
          console.log("SUCCESS")
          req.body = {
            userId: user.iduser,
            username: user.username,
          };
          return next();
        } else {
          return res.status(400).send({
            errors: ['Invalid username or password']
          });
        }
      }
    });
};

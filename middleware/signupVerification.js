const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

// Middlewares that check for duplicate records and verify roles is stored here
checkDuplicateRecords = (req, res, next) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }
      console.log("no duplicates found");
      next();
    });
  });
};

checkRoles = (req, res, next) => {
  console.log(req.body);
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          msg: `Failed! User Role ${req.body.roles[i]} does not exist`,
        });
        return;
      }
    }
  }
  console.log("all roles checked");
  next();
};
const verifySignup = {
  checkDuplicateRecords,
  checkRoles,
};
module.exports = verifySignup;

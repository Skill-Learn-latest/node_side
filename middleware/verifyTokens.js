const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      msg: "No Tokens found!",
    });
  }
  console.log(token);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ msg: "Unauthorized" });
    }
    req.userId = decoded.id;

    next();
  });
};

// Check if role is admin
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ msg: err });
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          return res.status(500).send({ msg: err });
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name == "admin") {
            next();
            return;
          }
        }
        return res.status(403).send({ msg: "Not admin role" });
      }
    );
  });
};
// Check if role is creator
isCreator = (req, res, next) => {
  console.log(req.body);
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(500).send({ msg: err });
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          return res.status(500).send({ msg: err });
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name == "creator") {
            next();
            return;
          }
        }
        return res.status(403).send({ msg: "Not creator role" });
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isCreator,
};

module.exports = authJwt;

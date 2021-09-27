const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

exports.signup = (req, res) => {
  console.log("Breaking point");
  console.log(req.body);
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  user.save((err, user) => {
    if (err) {
      return res.status(500).send({ msg: err });
    }
    // Check to request for any role attached
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            return res.status(500).send({ msg: err });
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              return res.status(500).send({ msg: err });
            }
            return res
              .status(200)
              .send({ msg: "User registered successfully" });
          });
        }
      );
    }
    // no role is attached to the request
    else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          return res.status(500).send({ msg: err });
        }
        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            return res.status(500).send({ msg: err });
          }
          return res.status(200).send({ msg: "User registered successfully" });
        });
      });
    }
  });
};

// login controller functions handles the response for login requests
exports.login = (req, res) => {
  console.log("login block entered");
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({
          msg: "err",
        });
      }
      if (!user) {
        return res.status(404).send({
          msg: "User not found",
        });
      }
      var passwordValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordValid) {
        return res.status(401).send({
          accessToken: null,
          msg: "Invalid password",
        });
      }
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      });
      var roles = [];
      for (let i = 0; i < user.roles.length; i++) {
        roles.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: roles,
        firstname: user.firstname,
        lastname: user.lastname,
        accessToken: token,
      });
    });
};

// get one user
exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .populate("roles", "-__V")
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({
          msg: err,
        });
      }
      if (!user) {
        return res.status(404).send({
          msg: "User not found",
        });
      }
      console.log(user);
      var roles = [];
      for (let i = 0; i < user.roles.length; i++) {
        roles.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        username: user.username,
        email: user.email,
        roles: roles,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    });
};

exports.updateUser = (req, res) => {
  console.log("update user entered");
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    }
    if (!user) {
      return res.status(404).send({
        msg: "User not found",
      });
    }
    console.log(req.body);
    user.username = req.body.username;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.save((err) => {
      if (err) {
        return res.status(500).send({
          msg: err,
        });
      }
      res.status(200).send({
        username: user.username,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    });
  });
};

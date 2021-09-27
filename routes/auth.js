const router = require("express").Router();
// const Role = require("../models/Role");
const { verifySignup, authJwt } = require("../middleware");
const auth_controller = require("../controllers/auth.controllers");
const user_controller = require("../controllers/user.controller");

// setup router handlers and callbacks
/**
 *  Pipeline of authentication middleware includes verifyToken, and verifySignup
 *  The controller for authorization checks the user roles during
 */
router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
// route for sign up
router.post(
  "/signup",
  [verifySignup.checkDuplicateRecords, verifySignup.checkRoles],
  auth_controller.signup

  // verifySignup.checkRoles;
  // controller.signup;
);
// route for login
router.post("/login", auth_controller.login);

// route for getting one user
router.get("/:id", [authJwt.verifyToken], auth_controller.getUser);

// route for updating user profile
router.put("/:id", [authJwt.verifyToken], auth_controller.updateUser);

// authorization checkers
router.get("/all", user_controller.allAccess);

router.get("/user", [authJwt.verifyToken], user_controller.userScreen);

router.get(
  "/creator",
  [authJwt.verifyToken, authJwt.isCreator],
  user_controller.creatorScreen
);

router.get(
  "/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  user_controller.adminScreen
);

router.get("/", (req, res) => {
  return res.send("authentication route");
});
module.exports = router;

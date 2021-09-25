const express = require("express");
const mongoose = require("mongoose");
const app = express();
const db = require("./models");
const Role = db.role;

// TO USE ENVIRONMENT VARIABLE
require("dotenv/config");

// TO PARSE DATA AS JSON WHEN SENT TO THE DATABASE

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect MongoDB at default port 27017.
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
      initializeRoles();
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);

// ROUTES
// Bring home some routes

const postsRoute = require("./routes/posts");
const authRoute = require("./routes/auth");

app.use("/posts", postsRoute);
app.use("/auth", authRoute);

// the home/default route
app.get("/", (req, res) => {
  return res.send("We are home");
});

// to start listening to the server
app.listen(3000);

// Check for initialization of user roles
function initializeRoles() {
  console.log("initializing roles");
  Role.estimatedDocumentCount((err, count) => {
    console.log(count);
    if (!err && count == 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error : " + err);
        }
        console.log("Role user created");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error : " + err);
        }
        console.log("Admin role created");
      });

      new Role({
        name: "creator",
      }).save((err) => {
        if (err) {
          console.log("error : " + err);
        }
        console.log("Creator role created");
      });
    }
  });
}

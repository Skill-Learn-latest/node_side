const db = {};

db.user = require("./User");
db.role = require("./Role");
db.post = require("./Post");

db.ROLES = ["user", "admin", "creator"];

module.exports = db;

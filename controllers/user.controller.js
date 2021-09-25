exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userScreen = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminScreen = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.creatorScreen = (req, res) => {
  res.status(200).send("CreatorContent Content.");
};

const User = require("../models/User");
const Activity = require("../models/Activity");

exports.makeAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, { role: "admin" });
    await Activity.create({ user: req.user.id, type: "OWNER_PROMOTE", text: `${req.user.id} promoted ${id} to admin`, ref: id });
    res.json({ message: "User promoted to admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, { role: "user" });
    await Activity.create({ user: req.user.id, type: "OWNER_DEMOTE", text: `${req.user.id} demoted ${id}`, ref: id });
    res.json({ message: "Admin removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

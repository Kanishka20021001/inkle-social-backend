const User = require("../models/User");
const Activity = require("../models/Activity");

exports.blockUser = async (req, res) => {
  try {
    const me = req.user.id;
    const target = req.params.id;
    if (me === target) return res.status(400).json({ message: "Cannot block yourself" });

    const meUser = await User.findById(me);
    const targetUser = await User.findById(target);
    if (!meUser || !targetUser) return res.status(404).json({ message: "User not found" });

    if (meUser.blockedUsers.map(String).includes(target)) return res.status(400).json({ message: "Already blocked" });

    meUser.blockedUsers.push(target);
    // optional: remove follow relationships
    meUser.following = meUser.following.filter(id => id.toString() !== target);
    meUser.followers = meUser.followers.filter(id => id.toString() !== target);
    targetUser.following = targetUser.following.filter(id => id.toString() !== me);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== me);

    await meUser.save();
    await targetUser.save();

    await Activity.create({
      user: me,
      type: "USER_BLOCKED",
      text: `${me} blocked ${target}`,
      ref: target
    });

    res.json({ message: "User blocked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const me = req.user.id;
    const target = req.params.id;

    const meUser = await User.findById(me);
    if (!meUser) return res.status(404).json({ message: "User not found" });

    meUser.blockedUsers = meUser.blockedUsers.filter((id) => id.toString() !== target);
    await meUser.save();

    await Activity.create({
      user: me,
      type: "USER_UNBLOCKED",
      text: `${me} unblocked ${target}`,
      ref: target
    });

    res.json({ message: "User unblocked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

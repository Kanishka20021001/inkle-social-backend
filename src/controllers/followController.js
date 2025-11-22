const User = require("../models/User");
const Activity = require("../models/Activity");

exports.followUser = async (req, res) => {
  try {
    const me = req.user.id;
    const target = req.params.id;

    if (me === target) return res.status(400).json({ message: "Cannot follow yourself" });

    const meUser = await User.findById(me);
    const targetUser = await User.findById(target);
    if (!meUser || !targetUser) return res.status(404).json({ message: "User not found" });

    // blocked checks
    if (targetUser.blockedUsers.map(String).includes(me)) {
      return res.status(403).json({ message: "You are blocked by this user" });
    }
    if (meUser.blockedUsers.map(String).includes(target)) {
      return res.status(403).json({ message: "You have blocked this user" });
    }

    if (meUser.following.map(String).includes(target)) return res.status(400).json({ message: "Already following" });

    meUser.following.push(target);
    targetUser.followers.push(me);

    await meUser.save();
    await targetUser.save();

    await Activity.create({
      user: me,
      type: "USER_FOLLOWED",
      text: `${me} followed ${target}`,
      ref: target
    });

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const me = req.user.id;
    const target = req.params.id;

    const meUser = await User.findById(me);
    const targetUser = await User.findById(target);
    if (!meUser || !targetUser) return res.status(404).json({ message: "User not found" });

    meUser.following = meUser.following.filter((id) => id.toString() !== target);
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== me);

    await meUser.save();
    await targetUser.save();

    await Activity.create({
      user: me,
      type: "USER_UNFOLLOWED",
      text: `${me} unfollowed ${target}`,
      ref: target
    });

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

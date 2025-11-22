const express = require("express");
const User = require("../models/User");
const router = express.Router();

// FOLLOW USER
router.post("/:id/follow", async (req, res) => {
  try {
    const currentUserId = req.body.userId;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "Already following" });
    }

    targetUser.followers.push(currentUserId);
    await targetUser.save();

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UNFOLLOW USER
router.post("/:id/unfollow", async (req, res) => {
  try {
    const currentUserId = req.body.userId;
    const targetUserId = req.params.id;

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await targetUser.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

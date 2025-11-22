const User = require("../models/User");
const Post = require("../models/Post");
const Like = require("../models/Like");
const Activity = require("../models/Activity");

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    await Activity.create({ user: req.user.id, type: "ADMIN_USER_DELETED", text: `${req.user.id} deleted user ${id}`, ref: id });
    res.json({ message: "User deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    await Post.findByIdAndDelete(id);
    await Activity.create({ user: req.user.id, type: "ADMIN_POST_DELETED", text: `${req.user.id} deleted post ${id}`, ref: id });
    res.json({ message: "Post deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteLike = async (req, res) => {
  try {
    const id = req.params.id; // like id
    await Like.findByIdAndDelete(id);
    await Activity.create({ user: req.user.id, type: "ADMIN_LIKE_DELETED", text: `${req.user.id} deleted like ${id}`, ref: id });
    res.json({ message: "Like deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Like = require("../models/Like");
const Activity = require("../models/Activity");
const Post = require("../models/Post");
const User = require("../models/User");

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // don't allow if post owner blocked current user
    const postOwner = await User.findById(post.user);
    if (postOwner.blockedUsers.map(String).includes(userId)) {
      return res.status(403).json({ message: "You are blocked by this user" });
    }

    const exists = await Like.findOne({ user: userId, post: postId });
    if (exists) return res.status(400).json({ message: "Already liked" });

    const like = new Like({ user: userId, post: postId });
    await like.save();

    await Activity.create({
      user: req.user.id,
      type: "POST_LIKED",
      text: `${req.user.id} liked post ${postId}`,
      ref: postId
    });

    res.json({ message: "Post liked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    await Like.findOneAndDelete({ user: userId, post: postId });

    await Activity.create({
      user: req.user.id,
      type: "POST_UNLIKED",
      text: `${req.user.id} unliked post ${postId}`,
      ref: postId
    });

    res.json({ message: "Post unliked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

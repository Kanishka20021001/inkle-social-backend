const Post = require("../models/Post");
const Activity = require("../models/Activity");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Post content required" });

    const post = new Post({ user: req.user.id, content });
    await post.save();

    await Activity.create({
      user: req.user.id,
      type: "POST_CREATED",
      text: `${req.user.id} created a post`,
      ref: post._id
    });

    res.json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(req.user.id);
    // if blocked by target or target blocked current -> hide
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    // if the target blocked current user, don't show posts
    if (target.blockedUsers.map(String).includes(req.user.id)) {
      return res.status(403).json({ message: "You are blocked by this user" });
    }

    const posts = await Post.find({ user: targetId }).populate("user", "name");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // only owner/admin/owner can delete
    if (post.user.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "owner") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Post.findByIdAndDelete(postId);

    await Activity.create({
      user: req.user.id,
      type: "POST_DELETED",
      text: `${req.user.id} deleted post ${postId}`,
      ref: postId
    });

    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

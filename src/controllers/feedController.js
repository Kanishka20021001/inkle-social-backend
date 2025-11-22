const Activity = require("../models/Activity");
const User = require("../models/User");
const Post = require("../models/Post");

exports.getFeed = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const blocked = me.blockedUsers.map(String);

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "name");

    // filter out activities from users who blocked me or whom I blocked
    const filtered = activities.filter(a => {
      const ua = a.user && a.user._id ? a.user._id.toString() : String(a.user);
      if (blocked.includes(ua)) return false;
      return true;
    });

    // map friendly text (populate when possible)
    const feed = await Promise.all(filtered.map(async (a) => {
      let actorName = a.user && a.user.name ? a.user.name : (a.user ? a.user.toString() : "Unknown");
      let text = a.text;

      // for likes/posts we may enrich text with post content
      if (a.type === "POST_CREATED" && a.ref) {
        const p = await Post.findById(a.ref).populate("user", "name");
        text = `${actorName} created a post: "${p ? p.content : ''}"`;
      }
      // fallback: use stored text
      return { id: a._id, type: a.type, text, createdAt: a.createdAt };
    }));

    res.json(feed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

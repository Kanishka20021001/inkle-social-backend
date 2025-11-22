const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { likePost, unlikePost } = require("../controllers/likeController");

router.post("/like/:id", auth, likePost);
router.post("/unlike/:id", auth, unlikePost);

module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { followUser, unfollowUser } = require("../controllers/followController");

router.post("/follow/:id", auth, followUser);
router.post("/unfollow/:id", auth, unfollowUser);

module.exports = router;

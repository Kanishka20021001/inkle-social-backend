const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const { deleteUser, deletePost, deleteLike } = require("../controllers/adminController");

router.delete("/user/:id", auth, isAdmin, deleteUser);
router.delete("/post/:id", auth, isAdmin, deletePost);
router.delete("/like/:id", auth, isAdmin, deleteLike);

module.exports = router;

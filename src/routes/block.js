const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { blockUser, unblockUser } = require("../controllers/blockController");

router.post("/block/:id", auth, blockUser);
router.post("/unblock/:id", auth, unblockUser);

module.exports = router;

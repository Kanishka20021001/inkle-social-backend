const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getFeed } = require("../controllers/feedController");

router.get("/", auth, getFeed);

module.exports = router;

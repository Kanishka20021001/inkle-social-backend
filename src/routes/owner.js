const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { isOwner } = require("../middleware/roleMiddleware");
const { makeAdmin, removeAdmin } = require("../controllers/ownerController");

router.post("/promote/:id", auth, isOwner, makeAdmin);
router.post("/demote/:id", auth, isOwner, removeAdmin);

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createActivity, getActivities } = require("../controllers/activityController");

router.post("/create", authMiddleware, createActivity);
router.get("/all", authMiddleware, getActivities);

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createPost, getPosts } = require("../controllers/postController");

router.post("/create", authMiddleware, createPost);
router.get("/all", getPosts);

module.exports = router;

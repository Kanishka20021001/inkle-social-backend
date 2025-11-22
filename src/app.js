require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

//routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Post routes
const postRoutes = require("./routes/post");
app.use("/posts", postRoutes);

// User routes
const userRoutes = require("./routes/user");
app.use("/users", userRoutes);

// Follow routes
const followRoutes = require("./routes/follow");
app.use("/follow", followRoutes);

// Like routes
const likeRoutes = require("./routes/like");
app.use("/like", likeRoutes);

// Block routes
const blockRoutes = require("./routes/block");
app.use("/block", blockRoutes);

// Admin routes
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// Owner routes
const ownerRoutes = require("./routes/owner");
app.use("/owner", ownerRoutes);


// NEW ROUTE (Feed)
const feedRoutes = require("./routes/feed");
app.use("/feed", feedRoutes);

// default route
app.get("/", (req, res) => {
  res.send("Inkle backend is working");
});

module.exports = app;

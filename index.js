require("dotenv").config();   // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activity");
const postRoutes = require("./routes/post");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB using .env file
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("DB Error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/activity", activityRoutes);
app.use("/posts", postRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

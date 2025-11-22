const User = require("../models/User");

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user || (user.role !== "admin" && user.role !== "owner")) {
            return res.status(403).json({ message: "Admin only" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const isOwner = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user || user.role !== "owner") {
            return res.status(403).json({ message: "Owner only" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { isAdmin, isOwner };

const router = require("express").Router();
const authRoutes = require("./auth.routes");
const { auth } = require("../middleware/auth.middleware");
const userRoutes = require("./user.routes");
const screenshotRoutes = require("./screenshoot.routes");
const sessionRoutes = require("./session.routes");
const timelapseRoutes = require("./timelapse.routes");
// non-protected routes
router.use("/auth", authRoutes);


// protected routes
router.use(auth);
router.use("/users", userRoutes);
router.use("/screenshoot", screenshotRoutes); //screenshot
router.use("/session", sessionRoutes);
router.use("/timelapse", timelapseRoutes);


module.exports = router;
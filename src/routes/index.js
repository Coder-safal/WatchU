const router = require("express").Router();
const authRoutes = require("./auth.routes");
const { auth, authorize } = require("../middleware/auth.middleware");
const userRoutes = require("./user.routes");
const screenshotRoutes = require("./screenshoot.routes");
const sessionRoutes = require("./session.routes");
const timelapseRoutes = require("./timelapse.routes");
const adminRoutes = require("./admin.routes");
const invoiceRoutes = require("./invoice.routes");
// non-protected routes
router.use("/auth", authRoutes);
// router.use("/auth/screenshot", screenshotRoutes); //screenshot



// protected routes
router.use(auth);
router.use("/users", userRoutes);
router.use("/screenshot", screenshotRoutes); //screenshot
router.use("/session", sessionRoutes);
router.use("/timelapse", timelapseRoutes);

// admin protected routes
router.use("/admin", authorize(['admin']), adminRoutes);
router.use("/admin", authorize(['admin']), invoiceRoutes);



module.exports = router;
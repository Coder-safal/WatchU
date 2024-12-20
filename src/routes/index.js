const router = require("express").Router();
const authRoutes = require("./auth.routes");
const { auth } = require("../middleware/auth.middleware");
const userRoutes = require("./user.routes");

// non-protected routes
router.use("/auth", authRoutes);


// protected routes
router.use(auth);
router.use("/users", userRoutes);


module.exports = router;
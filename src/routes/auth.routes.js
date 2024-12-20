// const userController = require("../controllers/user.controller");

const authController = require("../controllers/auth.controller");
const { userValidation } = require("../middleware/validator.middleware");

const router = require("express").Router();

router.route("/register").post(userValidation.register, authController.register);
router.route("/login").post(userValidation.login, authController.login);
router.route("/verify-email").post(userValidation.verifyEmail, authController.emailVerify);
router.route("/resend-token").post(authController.resendToken);
router.route("/forget-password").post(userValidation.forgetPassword, authController.forgetPassword);
router.route("/reset-password").post(userValidation.resetPassword, authController.resetPassword);
router.route("/refresh-token").post(userValidation.refreshToken, authController.refreshToken);


module.exports = router;88
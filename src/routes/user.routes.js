
const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { userValidation } = require("../middleware/validator.middleware");
const { authorize } = require("../middleware/auth.middleware");


router.route("/").get(userController.getMe);
router.route("/invite").post(authorize(['admin']), userValidation.validInvite, userController.invite);
router.route("/").patch(userValidation.changePassword, userController.updatePassword);




module.exports = router;
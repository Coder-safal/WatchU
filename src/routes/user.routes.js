
const router = require("express").Router();
const userController = require("../controllers/user.controller")

router.route("/").get(userController.getMe);
router.route("/invite").post(userController.invite);




module.exports = router;
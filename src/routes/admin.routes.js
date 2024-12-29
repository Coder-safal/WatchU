const router = require("express").Router();
const userController = require("../controllers/user.controller");


router.route("/update-user/:userId").patch(userController.updateUserByAdmin);
module.exports = router;
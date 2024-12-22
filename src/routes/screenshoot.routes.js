
const router = require("express").Router();
const screenshotController = require("../controllers/screnshot.controller");
const {upload} = require("../utils/multer.utils");


router.route("/").post(upload.single('screenshot'), screenshotController.uploadScreenshot);


module.exports = router;
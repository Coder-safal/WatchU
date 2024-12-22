const { upload } = require("../utils/multer.utils");
const timelapseController = require("../controllers/timelapse.controllers");

const router = require("express").Router();

router.route("/").post(upload.single('timelapse'), timelapseController.uploadTimelapse);

module.exports = router;
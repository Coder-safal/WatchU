const router = require("express").Router();
const sessionController = require("../controllers/session.controller");

router.route("/start").post(sessionController.startSession);
router.route("/:sessionId/stop").post(sessionController.stopSession);
router.route("/").patch(sessionController.updateSession);


module.exports = router;
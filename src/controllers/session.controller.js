const sessionService = require("../services/session.service");
const ApiResponse = require("../utils/apiresponse.utils");
const asyncHandler = require("../utils/asynchandler.utils")

class SessionController {

    startSession = asyncHandler(async (req, res) => {

        const result = await sessionService.startSession({ ...req.body });

        return res.status(201).json(
            new ApiResponse(
                201,
                "Session started succesfully!",
                result,
            )
        )
    });

    stopSession = asyncHandler(async (req, res) => {

    });


}

module.exports = new SessionController();
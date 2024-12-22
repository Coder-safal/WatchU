const sessionService = require("../services/session.service");
const ApiResponse = require("../utils/apiresponse.utils");
const asyncHandler = require("../utils/asynchandler.utils")

class SessionController {

    startSession = asyncHandler(async (req, res) => {

        const result = await sessionService.startSession({ ...req.user });

        return res.status(201).json(
            new ApiResponse(
                201,
                "Session started succesfully!",
                result,
            )
        )
    });

    stopSession = asyncHandler(async (req, res) => {

        const result = await sessionService.stopSession({ ...req.params });

        return res.status(200).json(new ApiResponse(200, "Session stop succesfully!", result));
    });

    updateSession = asyncHandler(async (req, res) => {
        const result = await sessionService.updateSession({ ...req.params });

        return res.status(200).json(new ApiResponse)

    });

}

module.exports = new SessionController();
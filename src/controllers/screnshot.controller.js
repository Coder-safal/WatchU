const asyncHandler = require("../utils/asynchandler.utils");
const ApiResponse = require("../utils/apiresponse.utils")

const screenshotService = require("../services/screenshot.service");

class ScrenshotController {

    uploadScreenshot = asyncHandler(async (req, res) => {

        const { sessionId } = req.params;
        const result = await screenshotService.uploadScreenshot(req?.file, sessionId, req.user?._id);

        return res.status(200).json(new ApiResponse(200, "Screenshoot uploaded succesfully!", result));

    });

    getAllScreenShoot = asyncHandler(async (req, res) => {

        const result = await screenshotService.getAllScreenShoot({ ...req?.params });//session id

        return res.status(200).json(new ApiResponse(200, "All screenshot of this session is fetch succesfully!", result));

    });





}


module.exports = new ScrenshotController();
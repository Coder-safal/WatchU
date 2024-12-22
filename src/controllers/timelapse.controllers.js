const timelapseService = require("../services/timelapse.service");
const asyncHandler = require("../utils/asynchandler.utils");

class TimelapseController {


    uploadTimelapse = asyncHandler(async (req, res) => {
        await timelapseService.uploadTimelapse({ ...req?.file });

        return res.status(200).json(new ApiResponse(200, "Video upload succesfully!"));

    })


}


module.exports = new TimelapseController();
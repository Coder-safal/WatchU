
const Sessions = require("../models/Sessions");
const ApiError = require("../utils/apierror.utils")
class ScreenshotService {
    uploadScreenshot = async (Imagefile) => {

        if (!Imagefile) {
            throw new ApiError(404, "Image isn't found!");
        }

        // images ka ma rakhane
    }

    getAllScreenShoot = async ({ sessionId }) => {

        const allImages = await Sessions.find(sessionId);

        return allImages;
    }



}

module.exports = new ScreenshotService();
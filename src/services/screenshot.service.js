
const Sessions = require("../models/Sessions");
const ApiError = require("../utils/apierror.utils");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const Screenshot = require("../models/Screenshot");
class ScreenshotService {
    uploadScreenshot = async (Imagefile, sessionId, userId) => {
        if (!Imagefile) {
            throw new ApiError(404, "Image isn't found!");
        }

        const todayDate = this.getCurrentDate();

        const baseName = path.join(__dirname, `../../public/${userId.toString()}/${todayDate.toString()}`);

        let screenshot = await Screenshot.findOne({ sessionId, userId });

        if (!screenshot) {
            screenshot = await Screenshot.create({
                userId,
                sessionId,
                baseName,
                // screenshootUrl: [Imagefile.originalname]
            });
        }
        // else {

            screenshot.screenshotUrl.push(Imagefile.originalname);
            await screenshot.save({ validateBeforeSave: false });
        // }


        console.log("Upload images!");
        return screenshot.toObject();

    }

    getAllScreenShoot = async ({ sessionId }) => {

        const allImages = await Sessions.find({ sessionId, userId });

        return allImages;
    }

    // helper function
    getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }


}

module.exports = new ScreenshotService();
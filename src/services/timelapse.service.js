

class TimelapseService {
    uploadTimelapse = async (Videofile) => {
        if (!Videofile) {
            throw new ApiError(404, "Video isn't found");
        }

        // video katw rakhane todo

    }

    getTimelapse = async ({ sessionId }) => {


    }

}



module.exports = new TimelapseService();
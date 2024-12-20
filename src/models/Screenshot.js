const mongoose = require("mongoose")

const screenshotSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        screenshootUrl: {
            type: String,
        },
        // userId
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("Screenshot", screenshotSchema);
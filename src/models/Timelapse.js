
const mongoose = require("mongoose");


const timelapseSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        startTime: { //video ko startTime
            type: Date,
            required: true,
        },
        endTime: Date,
        timelapseUrl: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('Timelapse', timelapseSchema);
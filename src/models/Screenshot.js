const mongoose = require("mongoose")

const screenshotSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            // required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        baseName: {
            type: String,
            required: true,
        },

        screenshotUrl: [
            {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return v.match(/\.(jpeg|jpg|png|gif)$/i); // Ensures it's an image URL
                    },
                    message: props => `${props.value} is not a valid image URL!`
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);



module.exports = mongoose.model("Screenshot", screenshotSchema);
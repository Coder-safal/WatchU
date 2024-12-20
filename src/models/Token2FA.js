const mongoose = require("mongoose");

const token2faSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        expiryAt: {
            type: Date,
            required: true,
        }
    }
)

token2faSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model("Token2FA", token2faSchema);
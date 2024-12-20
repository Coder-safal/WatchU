const mongoose = require("mongoose");
const crypto = require("crypto");

const tokenResetSchema = new mongoose.Schema(
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
);

tokenResetSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });

tokenResetSchema.pre("save", async function (next) {
    if (!this.isModified('token')) {
        return next();
    }
    this.token = crypto.createHash('sha256').update(this.token).digest('hex');
    next();
})



module.exports = mongoose.model("TokenReset", tokenResetSchema);
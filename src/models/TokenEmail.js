const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

const tokenEmail = new mongoose.Schema(
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

tokenEmail.index({ expiryAt: 1 }, { expireAfterSeconds: 0 });

tokenEmail.pre("save", async function (next) {
    if (!this.isModified('token')) {
        return next();
    }
    this.token = crypto.createHash('sha256').update(this.token).digest('hex');
    next();
})



module.exports = mongoose.model("TokenEmail", tokenEmail);
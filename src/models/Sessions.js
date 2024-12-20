
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            // required: true,
        },
        totalTime: {
            type: Number, //seconds
            default: 0,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'interrupted'],
            default: 'active'
        },

        lastActivity: {
            type: Date,
            default: Date.now
        }

    }
);

// Indexes
sessionSchema.index({ userId: 1, startTime: -1 });
sessionSchema.index({ adminId: 1, startTime: -1 });
sessionSchema.index({ sessionId: 1 }, { unique: true });
sessionSchema.index({ status: 1, lastActivity: -1 });

sessionSchema.methods = {
    updateSession: async () => {
        this.totalTime = this.status === 'active' ? Math.floor(Date.now() - this.startTime.getTime()) : Math.floor(this.endTime - this.startTime);
        this.lastActivity = new Date(),
            await this.save();
    }
}

module.exports = mongoose.model("Session", sessionSchema);

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        project: {
            type: String,
            // required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'employee'],
            default: 'admin'
        },
        status: {
            type: String,
            emum: ['active'],
            default: 'active'
        },
        postion: { //employe
            type: String,
            // required: true,
        },
        dateJoined: {
            type: Date,
            default: new Date(),
        },
        hourlyRate: {
            type: Number,
            default: 0,

        },
    },
    {
        timestamps: true,
    }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcryptjs.hash(this.password, 12);
    next();
})

// methods

userSchema.methods = {
    comparePassword: async function (password) {
        return await bcryptjs.compare(password, this?.password);
    },

    generateAuthToken: function () {
        return jwt.sign({
            _id: this._id,
            organizationId: this?.organizationId,
            role: this.role,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }

        )
    },

    generateRefreshToken: function () {
        return jwt.sign({
            _id: this._id
        },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            }
        );
    },

    generateResetToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex').slice(0, 6);
        return resetToken;
    },

}



module.exports = mongoose.model("User", userSchema);

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
            select: false,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        department: {
            type: String,
            // required: true,
        },
        is2Fa: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ['admin', 'employee'],
            default: 'admin'
        },
        settings: {
            // 
        },
        status: {
            type: String,
            emum: ['active'],
            default: 'active'
        },

        metaData: {

        }
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
        return await bcryptjs.compare(password, this.password);
    },

    generateAuthToken: function () {
        return jwt.sign({
            _id: this._id,
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
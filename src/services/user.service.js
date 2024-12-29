const { sendEmail } = require("../config/email");
const User = require("../models/User");
const ApiError = require("../utils/apierror.utils");
const crypto = require("crypto");

class UserService {

    invite = async ({ email, fullName, role, inviteByRole, position, project, hourlyRate, organizationId }) => {

        if (!this.allowedInvite({ role, inviteByRole })) {
            throw new ApiError(403, "Permission denied!");
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            throw new ApiError(409, "Already Users exists!");
        }

        const randomPassword = crypto.randomBytes(32).toString('hex').slice(0, 10);

        const user = await User.create({
            email,
            role,
            fullName,
            password: randomPassword,
            organizationId,
            isEmailVerified: true,
            hourlyRate,
            position,
            project,
        });

        if (!user) {
            throw new ApiError(500, "Internal Errors!");
        }

        await sendEmail({
            to: email,
            subject: 'Password',
            template: 'invite-user',
            data: {
                companyName: 'Brand-Builder',
                currYear: new Date().getFullYear(),
                token: this.generatePassword(),
            }
        });

        return;
    }


    findUserById = async (userId) => {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User doesn't found!");
        }

        return user.toObject();
    }

    updatePassword = async ({ email, oldPassword, newPassword }) => {

        if (oldPassword === newPassword) {
            throw new ApiError(409, "oldPassword and newPassword mustn't be same");
        }

        const user = await User.findOne({ email }).select("+password");

        // console.log("Password compare", await user?.comparePassword(oldPassword));
        const validPassword = await user?.comparePassword(oldPassword);

        if (!user || !validPassword) {
            throw new ApiError(400, "Invalid credentials!");
        }
        user.password = newPassword;

        // await user.save({ validateBeforeSave: true });
        await user.save({ validateBeforeSave: true });

        return user;
    }




    updateUserByAdmin = async (userId, updateData) => {

        console.log("UserId : ", userId, "updateData: ", updateData);

        const allowedUpdate = ['position', 'project', 'hourlyRate'];

        const updates = {};

        Object.keys(updateData).forEach((key) => {
            if (allowedUpdate.includes(key)) {
                updates[key] = updateData[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true, runValidators: true,
            }
        );

        if (!user) {
            throw new ApiError(404, "User doesnt' exist!");
        }

        return user.toObject();
    }



    // Helper function
    allowedInvite = ({ role, inviteByRole }) => {
        const adminAllowed = ['employee'];
        if (inviteByRole == 'admin' && adminAllowed.includes(role)) {
            return true;
        }
        return false;
    }

    // generate random Password for invitation
    getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generatePassword = (length) => {
        let charset = "abcdefghijkABCDEFGHIJKLMNOPQRSTlmnopqrstuvwxyzUVWXYZ0123456789+_)(*&^%$#@!}/;'[]\"?><:{}123456789";
        let retVal = "";
        for (let i = 0; i < length; ++i) {
            retVal += charset.charAt(getRandomInt(0, charset.length));
        }
        return retVal;
    }

}


module.exports = new UserService();
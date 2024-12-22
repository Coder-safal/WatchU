const { sendEmail } = require("../config/email");
const User = require("../models/User");
const ApiError = require("../utils/apierror.utils");
const crypto = require("crypto");

class UserService {

    invite = async ({ email, fullName, role, inviteByRole, position, hourlyRate }) => {

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
            adminId,
            isEmailVerified: true,
            hourlyRate,
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
                token: randomPassword,
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

        const user = await User.findOne({ email });
        if (!user || !user?.comparePassword(oldPassword)) {
            throw new ApiError(401, "Invalid credentials!");
        }
        user.password = newPassword;

        // await user.save({ validateBeforeSave: true });
        await user.save();

        return;
    }











    // Helper function
    allowedInvite = ({ role, inviteByRole }) => {
        const adminAllowed = ['employee'];
        if (inviteByRole == 'admin' && adminAllowed.includes(role)) {
            return true;
        }
        return false;
    }

}


module.exports = new UserService();
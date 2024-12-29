const ApiError = require("../utils/apierror.utils");
const User = require("../models/User");
const TokenEmail = require("../models/TokenEmail");
const TokenReset = require("../models/TokenReset")
const { sendEmail } = require("../config/email");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");
// const crypto = require("crypto");

class AuthService {
    register = async ({ fullName, email, password, companyName }) => {
        try {

            const existUser = await User.findOne({ email });
            if (existUser) {
                throw new ApiError(409, "Users already exists!");
            }

            const organization = await Organization.create({
                name: companyName,
            });


            const user = await User.create({
                email,
                fullName,
                password,
                organizationId: organization?._id,
            });

            organization.ownerId = user?._id;
            await organization.save();

            const token = user.generateResetToken();

            const minutes = 2;

            await TokenEmail.create({
                token,
                userId: user?._id,
                expiryAt: new Date(Date.now() + minutes * 60 * 1000)
            })
            // console.log("Token saved successfully. Sending email...");

            const currYear = new Date().getFullYear();

            await sendEmail({
                to: email,
                subject: 'Verify Email',
                template: 'verify-email',
                data: {
                    expiryIn: minutes,
                    currYear,
                    companyName: 'Brand Builder',
                    token,
                }
            });


            return;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, error.message || "An error occurred while creating the user.");
        }
    }

    emailVerify = async (token) => {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const tokenUser = await TokenEmail.findOne({ token: tokenHash });
        if (!tokenUser) {
            throw new ApiError(400, "Invalid or expired email verification tokens");
        }

        const user = await User.findById(tokenUser?.userId);
        if (!user || user.isEmailVerified) {
            throw new ApiError(400, "Unable to verify user email!");
        }

        user.isEmailVerified = true;

        await user.save({ validateBeforeSave: false });
        return;
    }

    resendToken = async ({ email }) => {

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(404, "Users doesn't found");
        }

        if (user?.isEmailVerified) {
            throw new ApiError(400, "User already verify!");
        }

        await TokenEmail.findOneAndDelete({ userId: user?._id });

        const token = user.generateResetToken();
        const min = 2;
        const tokenEmail = await TokenEmail.create({
            token,
            userId: user?._id,
            expiryAt: new Date(Date.now() + min * 60 * 1000)
        });

        if (!tokenEmail) {
            throw new ApiError(500, "Error while resend Token");
        }

        const currYear = new Date().getFullYear();
        await sendEmail({
            to: email,
            subject: 'Verify Your Email',
            template: 'verify-email',
            data: {
                expiryIn: min,
                currYear,
                companyName: 'Brand Builder',
                token,
            }
        });

        return;
    }

    login = async ({ email, password }) => {
        const user = await User.findOne({ email }).select("+password");

        if (!user) throw new ApiError(401, "Invalid credentials!");
        if (!user?.isEmailVerified) throw new ApiError(401, "Email isn't verified, Please verify your email before proceeding");
        if (!(await user.comparePassword(password))) throw new ApiError(400, "Invalid credential!");


        return {
            token: user?.generateAuthToken(),
            refreshToken: user?.generateRefreshToken(),
        };
    }


    forgetPassword = async ({ email }) => {

        try {
            const user = await User.findOne({ email });
            if (!user || !user?.isEmailVerified) {
                throw new ApiError(400, "Invalid credentials or Email isn't verify");
            }
            const min = 2;

            // const token = this.generateRandomPassword();
            console.log("Hello my check!");
            const token = user.generateResetToken();

            await TokenReset.create({
                token,
                userId: user?._id,
                expiryAt: new Date(Date.now() + min * 60 * 1000)
            });


            const currYear = new Date().getFullYear();

            await sendEmail({
                to: email,
                subject: 'Reset Password',
                template: 'forget-password',
                data: {
                    expiryIn: min,
                    currYear,
                    companyName: 'Brand Builder',
                    token,
                }
            });

            return;
        } catch (error) {
            // throw new ApiError(500, "Internal Error");
            throw error;
        }


    }

    resetPassword = async ({ token, password }) => {
        try {

            const hashToken = crypto.createHash('sha256').update(token).digest('hex');

            const tokenUser = await TokenReset.findOne({ token: hashToken })

            if (!tokenUser) {
                throw new ApiError(400, "Invalid Token or expiry token!");
            }


            const user = await User.findById(tokenUser?.userId);
            if (!user) {
                throw new ApiError(400, "users doesn't exists");
            }

            user.password = password;

            await user.save();

            await TokenReset.findByIdAndDelete(tokenUser?._id);

            return;
        } catch (error) {
            throw error;
        }


    }


    refreshToken = async (token) => {

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) {
                throw new ApiError(401, "Invalid token");
            }

            const user = await User.findById(decoded?._id);
            if (!user) {
                throw new ApiError(401, "Invalid refreshToken!");
            }

            return {
                token: user.generateAuthToken()
            }
        } catch (error) {
            throw new ApiError(401, "Invalid refreshToken!");
        }

    }


    // helper function

    generateRandomPassword = (length = 9) => {
        // Characters to include in the password
        const lowerCase = "abcdefghijklmnopqrstuvwxyz";
        const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

        // Combine all character sets
        const allCharacters = lowerCase + upperCase + numbers + symbols;

        // Ensure password includes at least one character from each set
        const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
        const passwordArray = [
            getRandomChar(lowerCase),
            getRandomChar(upperCase),
            getRandomChar(numbers),
            getRandomChar(symbols),
        ];

        // Fill the rest of the password length with random characters
        for (let i = passwordArray.length; i < length; i++) {
            passwordArray.push(getRandomChar(allCharacters));
        }

        // Shuffle the password to randomize character positions
        const shuffledPassword = passwordArray.sort(() => Math.random() - 0.5);

        // Return the password as a string
        return shuffledPassword.join('');
    }

}


module.exports = new AuthService();
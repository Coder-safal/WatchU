const asyncHandler = require("../utils/asynchandler.utils");
const ApiResponse = require("../utils/apiresponse.utils");
const authService = require("../services/auth.service");


class AuthController {

    register = asyncHandler(async (req, res, next) => {

        try {
            await authService.register({ ...req.body });
            return res.status(201).json(
                new ApiResponse(201, "Please verify your email,OTP has been send to your email")
            );
        } catch (error) {
            next(error)
        }
    });

    emailVerify = asyncHandler(async (req, res, next) => {

        try {
            const { token } = req.body;
            await authService.emailVerify(token);
            return res.status(200).json(
                new ApiResponse(200, "Email verify succesfully")
            );
        } catch (error) {
            next(error);
        }
    });


    resendToken = asyncHandler(async (req, res, next) => {
        try {
            await authService.resendToken(req.body);
            res.status(200).json(new ApiResponse(200, "Please verify your email,OTP has been send to your email"));
        } catch (error) {
            next(error);

        }
    })

    login = asyncHandler(async (req, res, next) => {

        try {
            const result = await authService.login({ ...req.body });

            return res.status(200).json({ success: true, data: { message: "User login succesfully", ...result } });
        } catch (error) {
            next(error);

        }
    });

    forgetPassword = asyncHandler(async (req, res, next) => {

        try {
            await authService.forgetPassword(req.body);

            return res.status(200).json(new ApiResponse(200, "Token send to you email"));
        } catch (error) {
            next(error)
        }

    });

    resetPassword = asyncHandler(async (req, res, next) => {
        try {
            await authService.resetPassword(req.body);
            return res.status(200).json(new ApiResponse(200, "Password reset succesfully!"));
        } catch (error) {
            next(error)
        }
    });


    refreshToken = asyncHandler(async (req, res) => {
        try {
            const { refreshToken: token } = req.body;

            const result = await authService.refreshToken(token);

            // res.status(200).json(new ApiResponse(200, "AuthToken generate succesfully!", result));
            res.status(200).json({ success: true, data: { "message": "AuthToken generate succesfully!", ...result } })
        } catch (error) {
            next(error);

        }

    })

}


module.exports = new AuthController();
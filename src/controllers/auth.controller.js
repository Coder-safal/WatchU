const asyncHandler = require("../utils/asynchandler.utils");
const ApiResponse = require("../utils/apiresponse.utils");
const authService = require("../services/auth.service");


class AuthController {

    register = asyncHandler(async (req, res, _) => {
        await authService.register({ ...req.body });
        return res.status(201).json(
            new ApiResponse(201, "Please verify your email,OTP has been send to your email")
        );
    });

    emailVerify = asyncHandler(async (req, res, next) => {
        const { token } = req.body;
        await authService.emailVerify(token);
        return res.status(200).json(
            new ApiResponse(200, "Email verify succesfully")
        );
    });


    resendToken = asyncHandler(async (req, res, next) => {
        await authService.resendToken(req.body);
        res.status(200).json(new ApiResponse(200, "Please verify your email,OTP has been send to your email"));
    })

    login = asyncHandler(async (req, res, next) => {

        const result = await authService.login({ ...req.body });
        
        return res.status(200).json({ success: true, data: { message: "User login succesfully", ...result } });
    });

    forgetPassword = asyncHandler(async (req, res, next) => {
        await authService.forgetPassword(req.body);

        return res.status(200).json(new ApiResponse(200, "Token send to you email"));

    });

    resetPassword = asyncHandler(async (req, res, next) => {
        await authService.resetPassword(req.body);
        return res.status(200).json(new ApiResponse(200, "Password reset succesfully!"));
    });


    refreshToken = asyncHandler(async (req, res) => {
        const { refreshToken: token } = req.body;

        const result = await authService.refreshToken(token);

        // res.status(200).json(new ApiResponse(200, "AuthToken generate succesfully!", result));
        res.status(200).json({ success: true, data: { "message": "AuthToken generate succesfully!", ...result } })

    })

}


module.exports = new AuthController();
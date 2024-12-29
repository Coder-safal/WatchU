const userService = require("../services/user.service");
const ApiError = require("../utils/apierror.utils");
const ApiResponse = require("../utils/apiresponse.utils");
const asyncHandler = require("../utils/asynchandler.utils");


class UserController {

    invite = asyncHandler(async (req, res) => {
        const { role: inviteByRole, _id: organizationId } = req?.user;
        const result = await userService.invite({ ...req.body, inviteByRole, organizationId });

        return res.status(200).json(new ApiResponse(200, "User invite succesfully!"));

    });

    getMe = asyncHandler(async (req, res) => {
        const { _id: userId } = req.user;
        const result = await userService.findUserById(userId);
        return res.status(200).json(new ApiResponse(200, "user details fetch succesfully!", result));
    })

    updatePassword = asyncHandler(async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const { email } = req.user;

        await userService.updatePassword({ oldPassword, newPassword, email });

        return res.status(200).json(new ApiResponse(200, "Password change succesfully!"));

    });

    updateUserByAdmin = asyncHandler(async (req, res) => {

        const updateData = { ...req.body };
        const { userId } = req.params;
        const result = await userService.updateUserByAdmin(userId, updateData);

        return res.status(200).json(new ApiResponse(200, "User update succesfully!", result));

    });

}


module.exports = new UserController();
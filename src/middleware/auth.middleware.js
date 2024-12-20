const asyncHandler = require("../utils/asynchandler.utils")
const ApiError = require("../utils/apierror.utils");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new ApiError(401, "Aunthentication required!");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded?._id);

        if (!user) { //check user status active or not
            throw new ApiError(401, "Aunthentication failed!", 401);
        }
        req.user = user;
        next();
    } catch (error) {
        // next(new ApiError(401, "Aunthentication failed"));
        throw error;
    }
})

const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Permission denied");
        }
        next();
    }

}

module.exports = { auth, authorize };
//defining error middleware

const logger = require("../config/logger");
const ApiError = require("../utils/apierror.utils");

const errorMiddleware = (err, req, res, next) => {
    // logger.info(err);
    logger.error(err);
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = new ApiError(400, message);
    }
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ApiError(400, message)
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ApiError(400, message)
    }
    res.status(error.statusCode || 500).json({
        status: error.status,
        data: {
            // success: false,
            message: error.message,
        }
    });
};
module.exports = errorMiddleware;
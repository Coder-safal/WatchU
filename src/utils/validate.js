const { validationResult } = require("express-validator");

const validate = (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            status: 'fail', data: {
                message: error.array().map((err) => err.msg).join(', '),
            }
        });
    }
    next();
}

module.exports = validate;
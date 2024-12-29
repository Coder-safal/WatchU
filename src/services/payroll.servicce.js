const Payroll = require("../models/Payroll");
const User = require("../models/User");
const ApiError = require("../utils/apierror.utils");

class PayrollService {

    getUserPayroll = async (userId, deductions = 0) => {

        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found!");
        }

        const hourlyRate = user?.hourlyRate;

        const payroll = await Payroll.calculatePayroll(userId, hourlyRate);

        return payroll;

    }

    getPaidPayroll = async (adminId) => {


    }

}



module.exports = new PayrollService();
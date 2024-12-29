const asyncHandler = require("../utils/asynchandler.utils");
const payrollService = require("../services/payroll.servicce");

class PayrollController {

    getUserPayroll = asyncHandler((req, res) => {

        const result = payrollService.getUserPayroll(userId, deductions);

        return res.status(200).json(200, "User payroll fetch succesfully!", result);
    });

 

}




module.exports = new PayrollController();
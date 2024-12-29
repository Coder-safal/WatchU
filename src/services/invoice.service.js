
const Invoice = require("../models/Invoice");
const ApiError = require("../utils/apierror.utils");
const User = require("../models/User");

class invoiceService {

    /* 
     startDate=new Date(year,month,1)
     endDate=new Date(year,month+1,0);
    */
    getMounthlyInvoice = async (userId,adminId) => {

        const user = await User.findById(userId);

        const currDate = new Date();
        const hourlyRate = user?.hourlyRate;
        // const adminId = user?.adminId;
        const year = currDate.getFullYear();
        const month = currDate.getMonth() + 1;

        const result = await Invoice.calculateMonthlyInvoice(userId, adminId, year, month, hourlyRate);

        console.log("Invoice of User: ", result);

        return result;

    }

    getRequestInvoice = async () => {
        await Invoice.calculateInvoiceForDateRange()
    }

}


module.exports = new invoiceService();




























const Invoice = require("../models/Invoice");
const ApiError = require("../utils/apierror.utils");

class invoiceService {

    /* 
     startDate=new Date(year,month,1)
     endDate=new Date(year,month+1,0);
    */
    getMounthlyInvoice = async () => {

        const invoiceMontly = await Invoice.create(
            {

            }
        )


    }

}


module.exports = new invoiceService();



























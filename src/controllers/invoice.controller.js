const invoiceService = require("../services/invoice.service");
const asyncHandler = require("../utils/asynchandler.utils");

class InvoiceController {
    getMounthlyInvoice = asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const result = invoiceService.getMounthlyInvoice(userId, req?.user?._id);

        return res.status(200).json(new ApiResponse(200, "Invoice generate succesfully", result));
    });
}


module.exports = new InvoiceController();
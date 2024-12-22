
const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        payPeriod: String,
        totalPay: {
            type: Number,
            required: true,
        },
        taxAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        deductions: {
            type: Number,
            default: 0,
        },
        paymentDate: {
            type: Date,
            default: new Date(),
        },
        paymentMethods: {
            type: String,
            enum: ['cash', 'bank_transfer', 'e-sewa'],
            default: null,
        }

    },
    {
        timestamps: true,
    }
);



payrollSchema.statics = {

    calculatePayroll: async (invoiceId) => {

        const Invoice = mongoose.model('Invoice');





    }

}


module.exports = mongoose.model("Payroll", payrollSchema);
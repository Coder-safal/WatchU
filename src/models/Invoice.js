
const mongoose = require("mongoose");


const invoiceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        totalHoursWorked: {
            type: Number,
            default: 0,
            min: 0,
        },
        issuedDate: {
            type: Date,
            default: new Date(),
        },
        dueDate: {
            type: Date,

        },
        invoiceNumber: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'cancelled']
        },

    }
);

invoiceSchema.index({ invoiceNumber: 1 });

invoiceSchema.statics = {
    // calculate monthly
    calculateMonthlyInvoice: async (userId, adminId, year, month, hourlyRate) => {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        return await this.calculateInvoiceForDateRange(userId, adminId, startDate, endDate, hourlyRate);

    },
    // calulate range
    calculateInvoiceForDateRange: async (userId, adminId, startDate, endDate, hourlyRate) => {

        const Session = mongoose.model('Session');

        // find all completed sessions within the date range

        const sessions = await Session.find(
            {
                userId,
                adminId,
                status: 'completed',
                date: {
                    $gte: startDate,
                    $lte: endDate,
                }
            }
        );

        // calculate total hours worked
        const totalSeconds = sessions.reduce((acc, session) => acc + session.totalSeconds, 0);
        const totalHoursWorked = parseFloat((totalSeconds / 3600)).toFixed((2));// converts seconds to hours

        const randomValue = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

        const invoiceNumber = `INV-${userId}-${adminId}-${startDate.getFullYear()}${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${randomValue}`;

        // issuedDate and dueDate
        const issuedDate = new Date();
        const dueDate = new Date();
        const day = 15;
        dueDate.setDate(issuedDate.getDate() + day);

        // create invoice objects
        const invoiceData = {
            userId,
            adminId,
            totalHoursWorked,
            totalAmount: totalHoursWorked >= 0 ? totalHoursWorked * hourlyRate : 0,
            issuedDate,
            dueDate,
            invoiceNumber,
            paymentStatus: 'pending',
        }

        // create and return the new invoice

        return await mongoose.model('Invoice').create(invoiceData);
    }



}

module.exports = mongoose.model("Invoice", invoiceSchema);
// kolai kati diyio , after invoice
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
        totalWorkingHours: {
            type: Number,
            default: 0,
            min: 0,
        },
        payPeriod: String,
        totalPay: {
            type: Number,
            // required: true,
        },
        taxAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        deductions: {
            type: Number,
            default: 0,
            min: 0,
        },
        paymentDate: {
            type: Date,
            // default: new Date(),
        },
        paymentMethods: {
            type: String,
            enum: ['cash', 'bank_transfer', 'e-sewa'],
            default: null,
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'unpaid'],
            default: 'unpaid',
        },

    },
    {
        timestamps: true,
    }
);



payrollSchema.statics = {

    updatePayroll: async (userId, adminId, sessionId) => {
        const Payroll = mongoose.model('Payroll');

        let payroll = await Payroll.find({ userId, adminId, paymentStatus: 'unpaid' });

        if (!payroll) {
            payroll = await Payroll.create({
                userId,
                adminId,
                sessionId,
            });

        }

        const Session = mongoose.model('Session');
        const session = await Session.find({ sessionId });
        const totalWorkingHours = session.totalTime;

        payroll.totalWorkingHours += totalWorkingHours;
        await payroll.save();
    },

    calculatePayroll: async (userId, hourlyRate) => {

        const Payroll = mongoose.model('Payroll');

        const payroll = await Payroll.findOne({ userId, paymentStatus: 'unpaid' });

        /* Calculate taxAmount and deduction:Todo */
        const totalPay = payroll?.totalWorkingHours * hourlyRate - deductions - taxAmount;
        const paymentDate = new Date();
        const update = { totalPay, paymentDate };

        const aftherUpdatePayroll = await Payroll.findByIdAndUpdate(
            payroll?._id,
            update,
            {
                new: true,
            }
        );
        console.log('Updated Payroll:', aftherUpdatePayroll);

        return aftherUpdatePayroll;

    }

}


module.exports = mongoose.model("Payroll", payrollSchema);
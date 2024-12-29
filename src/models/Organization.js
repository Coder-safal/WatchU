const mongoose = require("mongoose");


const organizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: { //organization status
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
        },
        department: [{ type: String }],
        metaData: {
            employeCount: { type: Number, default: 0 },
            activeUser: { type: Number, default: 0 }

        }
    },
    {
        timestamps: true,
    }
);

organizationSchema.index({ ownerId: 1 });
organizationSchema.index({ status: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
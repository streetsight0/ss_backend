const mongoose = require("mongoose");

const leaseAgreementSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "clients", required: true },
    // clientEmail: { type: String, required: true },
    // clientAddress: { type: String, required: true },
    // campaign: { type: mongoose.Schema.Types.ObjectId, ref: "campaigns", required: true },
    // billboardLocation: { type: mongoose.Schema.Types.ObjectId, ref: "billboards", required: true },
    billboardLocation:{ type: String, required: true },
    legalDescription: { type: String },

    campaignStartDate: { type: Date, required: true },
    campaignEndDate: { type: Date, required: true },
    securityDeposit: { type: Number, required: true },
    rentAmount: { type: Number, required: true },
    rentPaymentFrequency: { type: String, required: true }, // Monthly, Quarterly, etc.
    lateFeeAmount: { type: Number, required: true }, // Added field
    paymentAddress: { type: String, required: true }, // Added field

    annualRentIncrease: { type: Boolean, required: true },
    percentageIncrease: { type: Number },
    flatRateIncrease: { type: Number },

    earlyTerminationAllowed: { type: Boolean, required: true },
    earlyTerminationFee: { type: Boolean, required: true },

    maintenanceResponsibility: { type: String, enum: ["Landlord", "Tenant"], required: true },

  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaseAgreement", leaseAgreementSchema);


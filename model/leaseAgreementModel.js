const mongoose = require("mongoose");

const leaseAgreementSchema = new mongoose.Schema(
	{
		client: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "clients",
			required: true,
		},
		billboardLocation: { type: String, required: true },
		legalDescription: { type: String },
		tenantIsOnlyUser: {type: Boolean,required: true},
		tenantIsUsingBillboard: {type: Boolean,required: true},

		campaignStartDate: { type: Date, required: true },
		campaignEndDate: { type: Date, required: true },
		securityDeposit: { type: Number, required: true },
		rentAmount: { type: Number, required: true },
		rentPaymentFrequency: { type: String, required: true }, 
		lateFeeAmount: { type: Number, required: true }, 
		paymentAddress: { type: String, required: true }, 

		annualRentIncrease: { type: Boolean, required: true },
		percentageIncrease: { type: Number },
		flatRateIncrease: { type: Number },

		earlyTerminationAllowed: { type: Boolean, required: true },
		earlyTerminationFee: { type: Boolean, required: true },

		maintenanceResponsibility: {
			type: String,
			enum: ["Landlord", "Tenant"],
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("LeaseAgreement", leaseAgreementSchema);


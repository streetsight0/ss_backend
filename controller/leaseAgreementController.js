const LeaseAgreement = require("../model/leaseAgreementModel");

// Create a new lease agreement
const createLeaseAgreement = async (req, res) => {
	try {
		const { client, billboardLocation, legalDescription, campaignStartDate, campaignEndDate,
		securityDeposit, rentAmount, rentPaymentFrequency, lateFeeAmount, paymentAddress,
		annualRentIncrease, percentageIncrease, flatRateIncrease, earlyTerminationAllowed,
		earlyTerminationFee, maintenanceResponsibility } = req.body;

		const newLease = new LeaseAgreement({
			client, billboardLocation, legalDescription, campaignStartDate, campaignEndDate,
		securityDeposit, rentAmount, rentPaymentFrequency, lateFeeAmount, paymentAddress,
		annualRentIncrease, percentageIncrease, flatRateIncrease, earlyTerminationAllowed,
		earlyTerminationFee, maintenanceResponsibility
		});

		await newLease.save();
		res.status(201).json({ leaseAgreement: newLease });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get all lease agreements
const getLeaseAgreements = async (req, res) => {
	try {
		const agreements = await LeaseAgreement.find().populate("client");
		res.status(200).json(agreements);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Get a specific lease agreement by ID
const getLeaseAgreementById = async (req, res) => {
	try {
		const { id } = req.params;
		const leaseAgreement = await LeaseAgreement.findById(id).populate("client");

		if (!leaseAgreement) {
			return res.status(404).json({ message: "Lease agreement not found" });
		}

		res.status(200).json(leaseAgreement);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

const updateLeaseAgreement = async (req, res) => {
	try {
		const { id } = req.params;

		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: "No data provided to update" });
		}

		// Find and update the lease agreement
		const updatedLease = await LeaseAgreement.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedLease) {
			return res.status(404).json({ message: "Lease agreement not found" });
		}

		res.status(200).json({
			message: "Lease agreement updated successfully",
			leaseAgreement: updatedLease,
		});
	} catch (error) {
		console.error("Error during update:", error); // Log any error during the update
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Delete a lease agreement
const deleteLeaseAgreement = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedLease = await LeaseAgreement.findByIdAndDelete(id);

		if (!deletedLease) {
			return res.status(404).json({ message: "Lease agreement not found" });
		}

		res.status(200).json({ message: "Lease agreement deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

module.exports = {
	createLeaseAgreement,
	getLeaseAgreements,
	getLeaseAgreementById,
	updateLeaseAgreement,
	deleteLeaseAgreement,
};

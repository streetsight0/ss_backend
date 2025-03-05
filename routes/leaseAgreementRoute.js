const express = require("express");

const {createLeaseAgreement,getLeaseAgreements,getLeaseAgreementById,updateLeaseAgreement,deleteLeaseAgreement} = require("../controller/leaseAgreementController");
const route = express.Router();

// Create a new lease agreement
route.post("/createLeaseAgreements", createLeaseAgreement);

// Get all lease agreements
route.get("/getLeaseAgreements", getLeaseAgreements);

// Get a lease agreement by ID
route.get("/getLeaseAgreements/:id",getLeaseAgreementById);

// Update a lease agreement by ID
route.put("/updateLeaseAgreements/:id", updateLeaseAgreement);

// Delete a lease agreement by ID
route.delete("/deleteLeaseAgreements/:id", deleteLeaseAgreement);

module.exports = route;
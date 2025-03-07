const express = require("express");
const {sendInvoiceEmail , createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice } = require("../controller/invoiceController");

const route = express.Router();

route.post("/sendInvoiceEmail", sendInvoiceEmail);
route.post("/createinvoices", createInvoice); // Create a new invoice
route.get("/getinvoices", getInvoices); // Get all invoices
route.get("/getinvoices/:id", getInvoiceById); // Get invoice by ID
route.put("/updateinvoices/:id", updateInvoice); // Update invoice
route.delete("/deleteinvoices/:id", deleteInvoice); // Delete invoice

module.exports = route;

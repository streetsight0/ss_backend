const Invoice = require("../model/invoiceModel");

// Create a new invoice
const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, client, campaignName, companyName, month, totalAmount, location } = req.body;

    const newInvoice = new Invoice({
      invoiceNumber,
      client,
      campaignName,
      companyName,
      month,
      totalAmount,
      location
    });

    await newInvoice.save();
    res.status(201).json({invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an invoice
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice updated successfully!", invoice: updatedInvoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an invoice
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice };

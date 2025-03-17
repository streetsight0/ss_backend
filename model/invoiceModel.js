const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "clients", required: true },
  // campaignName: { type: String, required: true }, // Store campaign name as a string
  companyName: { type: String, required: true },
  month: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  location: { type: String, required: true }
}, { timestamps: true }); 

module.exports = mongoose.model("Invoice", invoiceSchema);

const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  client_name: { type: String, required: true },
  client_email: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  additional_companies: [{ type: String }], 
  address: { type: String, required: true },
  contact: { type: String, required: true }
});

module.exports = mongoose.model("clients", clientSchema);

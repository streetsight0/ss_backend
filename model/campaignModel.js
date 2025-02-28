const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaign_name: { type: String, required: true },
  campaign_start_date: { type: Date, required: true }, 
  campaign_end_date: { type: Date, required: true },   
  campaign_images: [{ type: String }], 
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: "clients", required: true },
  billboards: [{ type: mongoose.Schema.Types.ObjectId, ref: "billboards", required: true }]
});

module.exports = mongoose.model('Campaign', campaignSchema); 
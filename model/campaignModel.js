const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  campaign_name: { type: String, required: true },
  campaign_start_date: { type: String, required: true }, // Stored as string (can be changed to Date if needed)
  campaign_end_date: { type: String, required: true },
  campaign_images: {
    type: Array,
    items: {
      type: String,
      format: "uri"
    }
  },
  client_id: { type: String, required: true },
  // client_id: { type: mongoose.Schema.Types.ObjectId, ref: "clients", required: true },
  company_name: { type: String, required: true },
  client_email: { type: String, required: true },
  billboards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "billboards",
    required: true
  }]
});

module.exports = mongoose.model('campaigns', campaignSchema);

// User model
const mongoose = require('mongoose');
const billBoardSchema = new mongoose.Schema({
  billboard_series: { type: String, required: true },
  billboard_type: { type: String, required: true },
  location:{type: String,required: true },
  size: {
      "type": "string",
      "required": true
    },
    leaseStart: {
      "type": "string",
      "format": "date",
      "required": true
    },
    leaseEnd: {
      "type": "string",
      "format": "date",
      "required": true
    },
    pricePerMonth: {
      "type": "number",
      "required": true
    },
    uploadImages: {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uri"
      },
      
    },
});

module.exports = mongoose.model('billboards',billBoardSchema);

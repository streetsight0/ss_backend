// User model
const mongoose = require("mongoose");
const billBoardSchema = new mongoose.Schema({
	billboard_name: { type: String, required: true },
	billboard_series: { type: String, required: true },
	billboard_type: { type: String, required: true },
	location: {
		name: { type: String, required: true }, 
		latitude: { type: Number, required: true }, 
		longitude: { type: Number, required: true }, 
	},
	size: {
		type: "string",
		required: true,
	},
	leaseStart: {
		type: "string",
		format: "date",
		required: true,
	},
	leaseEnd: {
		type: "string",
		format: "date",
		required: true,
	},
	pricePerMonth: {
		type: "string",
		required: true,
	},
	billboard_images: [{ type: String }],
});

module.exports = mongoose.model("billboards", billBoardSchema);

const express = require("express");
const { createCampaign, getCampaigns, getCampaignById, updateCampaign, deleteCampaign } = require("../controller/campaignController");
const { upload } = require("../config/cloudinary");
const route = express.Router();
// route.post(
// 	"/createcampaigns",
// 	upload.array("campaign_images", 5),
// 	createCampaign
// ); // Accepts up to 5 images

route.post(
	"/createcampaigns",
	upload.array("campaign_images", 5), // Multer middleware
	(req, res, next) => {
		console.log("Received Headers:", req.headers);
		console.log("Received Body:", req.body);
		console.log("Received Files:", req.files);
		next();
	},
	createCampaign
);
route.get("/getcampaigns", getCampaigns);
route.get("/getcampaigns/:id", getCampaignById);
route.put("/updatecampaigns/:id", upload.array("campaign_images", 5), updateCampaign);
route.delete("/deletecampaigns/:id", deleteCampaign);

module.exports = route;

const express = require('express');
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
} = require('../controller/campaignController');

const route = express.Router();

route.post("/campaigns", createCampaign); // Create a new campaign
route.get("/campaigns", getCampaigns); // Get all campaigns
route.get("/campaigns/:id", getCampaignById); // Get campaign by ID
route.put("/campaigns/:id", updateCampaign); // Update campaign
route.delete("/campaigns/:id", deleteCampaign); // Delete campaign

module.exports = route;

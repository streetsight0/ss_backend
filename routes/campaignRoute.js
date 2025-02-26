const express = require('express');
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
} = require('../controller/campaignController');

const route = express.Router();

route.post("/createcampaigns", createCampaign); // Create a new campaign
route.get("/getcampaigns", getCampaigns); // Get all campaigns
route.get("/getcampaigns/:id", getCampaignById); // Get campaign by ID
route.put("/updatecampaigns/:id", updateCampaign); // Update campaign
route.delete("/deletecampaigns/:id", deleteCampaign); // Delete campaign

module.exports = route;

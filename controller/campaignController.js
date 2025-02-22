const Campaign = require('../model/campaignModel');

// Create a new campaign
const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all campaigns
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("billboards").populate("client_id");
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single campaign by ID


const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("billboards");
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};





// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete campaign
 const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {createCampaign,getCampaigns,getCampaignById,updateCampaign,deleteCampaign} ;
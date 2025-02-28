const Campaign = require('../model/campaignModel');
const cloudinary = require("../config/cloudinary");

// Create a new campaign with image uploads
const createCampaign = async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path); // Extract Cloudinary URLs
    const campaign = new Campaign({ ...req.body, campaign_images: imageUrls });
    await campaign.save();
    res.status(201).json({ data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all campaigns
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("billboards").populate("client_id");
    res.json({ data: campaigns });
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
    res.json({data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    let imageUrls = campaign.campaign_images; // Get existing images

    // If new images are uploaded, replace existing ones
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path); // Get new image URLs
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...req.body, campaign_images: imageUrls }, // Update campaign data
      { new: true }
    );

    res.json({ success: true, data: updatedCampaign });
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
    res.json({message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {createCampaign,getCampaigns,getCampaignById,updateCampaign,deleteCampaign} ;
const Campaign = require("../model/campaignModel");
const cloudinary = require("../config/cloudinary");

// Create a new campaign with image uploads or URLs
const createCampaign = async (req, res) => {
	try {
		const uploadedImages = req.files ? req.files.map((file) => file.path) : [];

		// Ensure campaign_images from body is an array
		const imageUrls = req.body.campaign_images
			? Array.isArray(req.body.campaign_images)
				? req.body.campaign_images
				: [req.body.campaign_images] // Convert single string to array
			: [];

		// Merge uploaded files & image URLs
		const campaignImages = [...uploadedImages, ...imageUrls].filter(Boolean);

		// Create and save the campaign
		const campaign = new Campaign({
			campaign_name: req.body.campaign_name,
			campaign_start_date: req.body.campaign_start_date,
			campaign_end_date: req.body.campaign_end_date,
			campaign_rent_monthly: req.body.campaign_rent_monthly,
			campaign_images: campaignImages.length > 0 ? campaignImages : undefined, // Avoid empty array
			client_id: req.body.client_id,
			billboards: req.body.billboards || [],
		});

		await campaign.save();
		res.status(201).json({ success: true, campaign });
	} catch (error) {
		console.error("Error creating campaign:", error);
		res.status(500).json({ success: false, error: error.message });
	}
};

const getCampaignsByClient = async (req, res) => {
	try {
		const { clientId } = req.params;

		// Validate client ID
		if (!clientId) {
			return res.status(400).json({ error: "Client ID is required" });
		}

		// Fetch campaigns associated with the client ID
		const campaigns = await Campaign.find({ client_id: clientId });

		// Check if campaigns exist
		if (!campaigns || campaigns.length === 0) {
			return res
				.status(404)
				.json({ message: "No campaigns found for this client" });
		}

		res.status(200).json({ success: true, campaigns });
	} catch (error) {
		console.error("Error fetching campaigns:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


// Get all campaigns
const getCampaigns = async (req, res) => {
	try {
		const campaigns = await Campaign.find()
			.populate("billboards")
			.populate("client_id");
		res.json({ success: true, data: campaigns });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get single campaign by ID
const getCampaignById = async (req, res) => {
	try {
		const campaign = await Campaign.findById(req.params.id).populate(
			"billboards"
		);
		if (!campaign) {
			return res
				.status(404)
				.json({ success: false, message: "Campaign not found" });
		}
		res.json({ success: true, data: campaign });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Update campaign (handle both file uploads & image URLs)
const updateCampaign = async (req, res) => {
	try {
		const campaign = await Campaign.findById(req.params.id);
		if (!campaign) {
			return res
				.status(404)
				.json({ success: false, message: "Campaign not found" });
		}

		// Get existing images
		let imageUrls = campaign.campaign_images || [];

		// If new files are uploaded, add them
		if (req.files && req.files.length > 0) {
			const uploadedImages = req.files.map((file) => file.path);
			imageUrls = [...imageUrls, ...uploadedImages];
		}

		// If new image URLs are provided, merge them
		if (req.body.campaign_images) {
			const newImageUrls = Array.isArray(req.body.campaign_images)
				? req.body.campaign_images
				: [req.body.campaign_images];
			imageUrls = [...imageUrls, ...newImageUrls];
		}

		// Remove duplicates
		imageUrls = [...new Set(imageUrls)];

		// Update campaign
		const updatedCampaign = await Campaign.findByIdAndUpdate(
			req.params.id,
			{
				...req.body,
				campaign_images: imageUrls.length > 0 ? imageUrls : undefined,
			},
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
			return res
				.status(404)
				.json({ success: false, message: "Campaign not found" });
		}
		res.json({ success: true, message: "Campaign deleted successfully" });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

module.exports = {
	createCampaign,
	getCampaigns,
	getCampaignById,
	updateCampaign,
	deleteCampaign,
	getCampaignsByClient,
};


const Billboard = require("../model/billBoardModel");
const { upload, cloudinary } = require("../config/cloudinary");

// Create a new billboard
// const createBillBoard = async (req, res) => {
// 	try {
// 		console.log("Received Body:", req.body); // Log form data
// 		console.log("Received Files:", req.files);
// 		const uploadedImages = req.files.map((file) => file.path); // Extract image URLs
// 		const billboard = new Billboard({ ...req.body, billboard_images: uploadedImages });
// 		await billboard.save();
// 		res.status(201).json({ message: "Billboard created successfully!", billboard });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ error: error.message });
// 	}
// };
const createBillBoard = async (req, res) => {
	try {
		

		// Extract uploaded file paths (if any)
		const uploadedImages =
			req.files?.length > 0 ? req.files.map((file) => file.path) : [];

		// Accept URLs from request body (Ensure it's an array)
		const urlImages = Array.isArray(req.body.billboard_images)
			? req.body.billboard_images
			: req.body.billboard_images
			? [req.body.billboard_images]
			: [];

		// Combine both uploaded images and URL images
		const allImages = [...uploadedImages, ...urlImages];

		// Create billboard object
		const billboard = new Billboard({
			...req.body,
			billboard_images: allImages,
		});

		// Save to database
		await billboard.save();

		res
			.status(201)
			.json({ message: "Billboard created successfully!", billboard });
	} catch (error) {
		console.error("Error creating billboard:", error);
		res.status(500).json({ error: error.message });
	}
};


// Get all billboards
const getBillBoards = async (req, res) => {
	try {
		const billboards = await Billboard.find();
		res.status(200).json(billboards);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Get a specific billboard by ID
const getBillBoardById = async (req, res) => {
	try {
		const { id } = req.params;
		const billboard = await Billboard.findById(id);
		if (!billboard) return res.status(404).json({ message: "Billboard not found" });
		res.status(200).json(billboard);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Update a billboard by ID
const updateBillBoard = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedData = req.body;
		// Handle file uploads for new images
		if (req.files) {
			const uploadedImages = req.files.map((file) => file.path);
			updatedData.billboard_images = uploadedImages;
		}

		const updatedBillboard = await Billboard.findByIdAndUpdate(id, updatedData, { new: true });
		if (!updatedBillboard) return res.status(404).json({ message: "Billboard not found" });
		res.status(200).json({ message: "Billboard updated successfully!", billboard: updatedBillboard });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Delete a billboard by ID
const deleteBillBoard = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedBillboard = await Billboard.findByIdAndDelete(id);
		if (!deletedBillboard) return res.status(404).json({ message: "Billboard not found" });
		res.status(200).json({ message: "Billboard deleted successfully!" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

module.exports = { createBillBoard, getBillBoards, getBillBoardById, updateBillBoard, deleteBillBoard };

require("dotenv").config(); // Load environment variables

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "campaigns",
		// format: async () => "jpg",
		allowed_formats: ["jpg", "png", "jpeg", "gif"],
		// public_id: (req, file) => file.originalname.split(".")[0],
	},
});

const upload = multer({ storage , limits: { fileSize: 10 * 1024 * 1024 } })// 10MB limit});

module.exports = { cloudinary, upload };

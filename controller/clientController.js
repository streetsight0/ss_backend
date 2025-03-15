const Client = require("../model/clientModel");
const { upload, cloudinary } = require("../config/cloudinary");

// Create a new client
const createClient = async (req, res) => {
	try {
		// Destructure client_logo along with other fields
		let {
			client_logo,
			client_name,
			client_email,
			company_name,
			additional_companies,
			address,
			contact,
		} = req.body;

		// If a file is uploaded, upload it to Cloudinary
		if (req.file) {
			const uploadResult = await cloudinary.uploader.upload(req.file.path);
			client_logo = uploadResult.secure_url; // Override with Cloudinary URL
		}
		// to cross check
			// console.log("File uploaded:", req.file);  
			// console.log("Cloudinary URL:", client_logo);

		const newClient = new Client({
			client_logo, // Now it contains either req.body value or Cloudinary URL
			client_name,
			client_email,
			company_name,
			additional_companies,
			address,
			contact,
		});

		
		await newClient.save();
		res.status(201).json({ data: newClient });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get all clients
const getClients = async (req, res) => {
	try {
		const clients = await Client.find();
		res.json({ data: clients });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Get a client by ID
const getClientById = async (req, res) => {
	try {
		const client = await Client.findById(req.params.id);
		if (!client) {
			return res
				.status(404)
				.json({ success: false, message: "Client not found" });
		}
		res.json({ data: client });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Update a client
const updateClient = async (req, res) => {
	try {
		let updatedData = { ...req.body };

		// If new file is uploaded, upload to Cloudinary
		if (req.file) {
			const uploadResult = await cloudinary.uploader.upload(req.file.path);
			updatedData.client_logo = uploadResult.secure_url; // Use Cloudinary URL
		}

		const updatedClient = await Client.findByIdAndUpdate(
			req.params.id,
			updatedData,
			{ new: true }
		);
		if (!updatedClient) {
			return res
				.status(404)
				.json({ success: false, message: "Client not found" });
		}
		res.json({ data: updatedClient });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

// Delete a client
const deleteClient = async (req, res) => {
	try {
		const deletedClient = await Client.findByIdAndDelete(req.params.id);
		if (!deletedClient) {
			return res
				.status(404)
				.json({ success: false, message: "Client not found" });
		}
		res.json({ message: "Client deleted successfully" });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

module.exports = {
	createClient,
	getClients,
	getClientById,
	updateClient,
	deleteClient,
};

const express = require("express");
const {
	createClient,
	getClients,
	getClientById,
	updateClient,
	deleteClient,
} = require("../controller/clientController");
const { upload } = require("../config/cloudinary"); // Import Multer setup

const route = express.Router();

route.post("/createclients", upload.single("client_logo"), createClient); // Add new client with logo upload
route.get("/getclients", getClients); // Get all clients
route.get("/getclients/:id", getClientById); // Get client by ID
route.put("/updateclients/:id", upload.single("client_logo"), updateClient); // Update client with new logo upload
route.delete("/deleteclients/:id", deleteClient); // Delete client

module.exports = route;

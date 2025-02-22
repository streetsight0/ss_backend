const express = require("express");
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require("../controller/clientController");

const route = express.Router();

route.post("/clients", createClient); // Add new client
route.get("/clients", getClients); // Get all clients
route.get("/clients/:id", getClientById); // Get client by ID
route.put("/clients/:id", updateClient); // Update client
route.delete("/clients/:id", deleteClient); // Delete client

module.exports = route;

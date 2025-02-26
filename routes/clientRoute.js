const express = require("express");
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require("../controller/clientController");

const route = express.Router();

route.post("/createclients", createClient); // Add new client
route.get("/getclients", getClients); // Get all clients
route.get("/getclients/:id", getClientById); // Get client by ID
route.put("/updateclients/:id", updateClient); // Update client
route.delete("/deleteclients/:id", deleteClient); // Delete client

module.exports = route;

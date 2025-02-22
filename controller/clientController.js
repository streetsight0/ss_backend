const Client = require("../model/clientModel");

// Create a new client
const createClient = async (req, res) => {
  try {
    const { client_name, client_email, company_name, additional_companies, address, contact } = req.body;

    const newClient = new Client({
      client_name,
      client_email,
      company_name,
      additional_companies,
      address,
      contact
    });

    await newClient.save();
    res.status(201).json({ success: true, data: newClient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a client by ID
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a client
const updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClient) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.json({ success: true, data: updatedClient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a client
const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createClient, getClients, getClientById, updateClient, deleteClient };

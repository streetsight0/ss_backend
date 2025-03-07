const Invoice = require("../model/invoiceModel");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const sendInvoiceEmail = async (req, res) => {
	try {
		const { to, subject, body } = req.body;
		const file = req.files?.pdf; // Get uploaded file

		if (!to || !file) {
			return res.status(400).json({ error: "Missing email or PDF file" });
		}

		// Define upload path
		const uploadPath = path.join(__dirname, "../uploads", file.name);
		console.log("Upload path:", uploadPath);

		// Ensure the uploads directory exists
		const uploadDir = path.dirname(uploadPath);
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		// Move the file and await completion
		await new Promise((resolve, reject) => {
			file.mv(uploadPath, (err) => {
				if (err) {
					console.error("Error moving file:", err);
					reject("Error uploading file");
				} else {
					console.log("File uploaded successfully");
					resolve();
				}
			});
		});

		// Set up email transporter
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// Send email with PDF attachment
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to,
			subject,
			text: body,
			attachments: [{ filename: file.name, path: uploadPath }],
		};

		// Await the email sending and handle success or failure
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent successfully:", info.response);

		// Send success response
		res.json({ message: "Invoice email sent successfully!" });

		// Delete the file after email sent
		try {
			fs.unlinkSync(uploadPath); // Delete file immediately
			console.log("File deleted successfully");
		} catch (deleteError) {
			console.error("Error deleting file:", deleteError);
		}
	} catch (error) {
		console.error("Error sending email:", error);
		// Ensure only one response is sent
		if (!res.headersSent) {
			res.status(500).json({ error: "Failed to send invoice email" });
		}
	}
};







// Create a new invoice
const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, client, campaignName, companyName, month, totalAmount, location } = req.body;

    const newInvoice = new Invoice({
      invoiceNumber,
      client,
      campaignName,
      companyName,
      month,
      totalAmount,
      location
    });

    await newInvoice.save();
    res.status(201).json({invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an invoice
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice updated successfully!", invoice: updatedInvoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an invoice
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
	sendInvoiceEmail,createInvoice,
	getInvoices,
	getInvoiceById,
	updateInvoice,
	deleteInvoice,
};

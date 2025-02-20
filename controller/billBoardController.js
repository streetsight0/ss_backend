const addBillboardSchema = require("../model/billBoardModel");

// to create a new bill board
const createBillBoard = async (req, res) => {
    pricePerMonth: {
        const {billboard_series , billboard_type, location,size,leaseStart,leaseEnd,pricePerMonth,uploadImages} = req.body;

    try {
        const newBillboard = new addBillboardSchema({ billboard_series, billboard_type, location,size,leaseStart,leaseEnd,pricePerMonth,uploadImages });
        await newBillboard.save();
        res.status(201).json({ message: "Billboard created successfully!", addBillboardSchema: newBillboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
}
//to get all billboards
const getBillBoards = async (req, res) => {
    try {
        const billboards = await addBillboardSchema.find(); // Retrieve all documents
        res.status(200).json(billboards); // Send response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
//to get a particular bboard
const getBillBoardById = async (req, res) => {
    try {
        const { id } = req.params; // Extract ID from URL
        const billboard = await addBillboardSchema.findById(id); // Find billboard by ID

        if (!billboard) {
            return res.status(404).json({ message: "Billboard not found" });
        }

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
        const updatedBillboard = await addBillboardSchema.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedBillboard) {
            return res.status(404).json({ message: "Billboard not found" });
        }

        res.status(200).json({ message: "Billboard updated successfully!", billboard: updatedBillboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

//  Delete a billboard by ID
const deleteBillBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBillboard = await addBillboardSchema.findByIdAndDelete(id);

        if (!deletedBillboard) {
            return res.status(404).json({ message: "Billboard not found" });
        }

        res.status(200).json({ message: "Billboard deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {createBillBoard, getBillBoards,getBillBoardById ,updateBillBoard ,deleteBillBoard} ;

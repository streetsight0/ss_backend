const express = require("express");
// const {addBillBoard} = require("../controller/billBoardController");
const {
	createBillBoard,
	getBillBoards,
	getBillBoardById,
	updateBillBoard,
	deleteBillBoard,
} = require("../controller/billBoardController");
const route = express.Router();

// Routes
route.post("/createbillboards", createBillBoard);
route.get("/getbillboards", getBillBoards);
route.get("/getbillboards/:id", getBillBoardById);
route.put("/updatebillboards/:id", updateBillBoard); // Update
route.delete("/deletebillboards/:id", deleteBillBoard); // Delete
module.exports = route;


const express = require("express");
// const {addBillBoard} = require("../controller/billBoardController");
const { createBillBoard, getBillBoards,getBillBoardById,updateBillBoard,deleteBillBoard } = require("../controller/billBoardController");
const route = express.Router();

// Routes
route.post("/billboards", createBillBoard);
route.get("/billboards", getBillBoards);
route.get("/billboards/:id", getBillBoardById)
route.put("/billboards/:id", updateBillBoard);  // Update
route.delete("/billboards/:id", deleteBillBoard); // Delete
module.exports = route;

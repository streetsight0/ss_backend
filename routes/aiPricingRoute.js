const express=require("express");
const { generatePriceEstimate } = require("../controller/aiPricingController");
const route = express.Router();
route.post("/billboardprice", generatePriceEstimate);

module.exports=route;
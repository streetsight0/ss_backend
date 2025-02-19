const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=> console.log("Connected to MongoDb"))
.catch((err)=> console.error("MongoDB connection error",err))

const userSchema = new mongoose.Schema({
    username: String,
    email:{type:String, unique:true},
    password: String,
});

const User = mongoose.model("User",userSchema);

const JWT_SECRET = process.env.JWT_SECRET;

const users = [];

app.get('/', (req, res) => {
    res.send("Welcome to the server");
  });

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
try{
    const existing = await User.findOne({email});
    if(existing){
        return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username,email,password:hashedPassword});
    await newUser.save();

    

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "User registered successfully!", token });
}catch(error){
    res.status(500).json({error:"server error"});
}
   

    
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
try{
    const user = await User.findOne({email});
    if(!user) return res.status(404).json({error:"User not found"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate a new token for each login attempt
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
    
}catch(error){
res.status(500).json({error:"server error"});
}
      // Send the new token in the response
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db.js");
const webRoutes = require("./routes/web.js");

const app = express();

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/", webRoutes);

module.exports = app;
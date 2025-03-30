import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.route.js";
import { connectDB } from "./config/db.js";

// Configure environment
import dotenv from "dotenv";
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/products", productRoutes);

// Default route
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});



// Export for Vercel
export default app;
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { fileURLToPath } from "url";
import productRoutes from "./routes/products.route.js";

// Load environment variables
dotenv.config();

// Fix: Define __dirname correctly for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS correctly with dynamic origin based on environment
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Connect to database (for both development and production)
connectDB();

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start server in development - Vercel handles production
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log("Server started at http://localhost:" + PORT);
    });
}

// Export for Vercel serverless functions
export default app;
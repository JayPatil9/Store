import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { fileURLToPath } from "url";
import productRoutes from "./routes/products.route.js";

// Load environment variables
dotenv.config();

// Get __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Apply CORS middleware correctly (Remove duplicate)
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// ✅ Start server locally (Fix: Un-comment app.listen)
if (process.env.NODE_ENV !== "production") {
    connectDB();  // Connect to the database before starting the server
    app.listen(PORT, () => {
        console.log("Server started at http://localhost:" + PORT);
    });
}

// ✅ Export app for Vercel deployment
export default app;

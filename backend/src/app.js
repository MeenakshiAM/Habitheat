import express from "express";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;

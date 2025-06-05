import express from "express";
import connectDB from "./config/database";
import routes from "./routes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
// Connection with MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());

app.use(express.json());
app.use("/api", routes);

app.get("/", (_req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const ipAddress = "0.0.0.0";
app.listen(PORT, ipAddress, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

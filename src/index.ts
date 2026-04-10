import express, { Application, Request, Response } from "express";
import cors from "cors";
import classifyRoutes from "./routes/classify.routes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Requirement: CORS header Access-Control-Allow-Origin: *
app.use(cors({ origin: "*" }));
app.use(express.json());

// API Routes
app.use("/api", classifyRoutes);

// Catch-all route for unhandled paths
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; // Exported for Vercel serverless compatibility

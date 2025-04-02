import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve images statically
app.use("/uploads", express.static(path.join(__dirname, "../images")));

//Middlewares
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
if (process.env.NODE_ENV === "prod") {
  app.use(morgan("combined"));
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/tag", tagRoutes);

// 404 Not Found Handler (Catches undefined routes)
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next({
    message: `Cannot find ${req.originalUrl} on this server!`,
    statusCode: 404,
  });
});

//ErrorHandler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

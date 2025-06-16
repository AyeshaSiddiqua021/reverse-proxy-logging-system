import "dotenv/config";
import express from "express";
import cors from "cors"; 
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import { OK } from "./constants/http";
import proxyRoutes from "./routes/proxy.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: APP_ORIGIN, 
    credentials: true,  
  })
);

// Health check route
app.get("/", (req, res) => {
  res.status(OK).json({ status: "healthy" });
});

//  routes
app.use("/auth", authRoutes);
app.use('/proxy',proxyRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`Server listening on port ${PORT} in ${NODE_ENV} environment`);
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});

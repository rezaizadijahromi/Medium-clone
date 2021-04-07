import express from "express";
import articleRoutes from "./routes/articleRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middlewares/errorMiddleWare.js";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

//routers//
app.use("/api/articles", articleRoutes);

// MiddleWares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

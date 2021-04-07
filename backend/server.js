import express from "express";
import articleRoutes from "./routes/articleRoutes.js";

const app = express();

//routers//
app.use("/", articleRoutes);

app.listen(5000);

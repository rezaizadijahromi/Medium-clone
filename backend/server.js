import express from "express";
import path from "path";
import articleRoutes from "./routes/articleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middlewares/errorMiddleWare.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import router from "./router.js";
import { addUser, removeUser, getUser, getUsersInRoom } from "./users.js";

dotenv.config();
connectDB();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(router);

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/test", testRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// MiddleWares
app.use(notFound);
app.use(errorHandler);

app.set("socketio", io);
console.log("Socket.io listening for connections");

const PORT = 5000;

server.listen(PORT, console.log(`Server running  on port ${PORT}`));

import express from "express";
import path from "path";
import articleRoutes from "./routes/articleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middlewares/errorMiddleWare.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import router from "./router.js";
import { addUser, removeUser, getUser, getUsersInRoom } from "./users.js";
import Article from "./models/articleModel.js";
import Document from "./Document.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(socket.id);
    socket.join(socket.id);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(socket.id).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(socket.id, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
app.set("socketio", io);
app.use(cors());
app.use(router);

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// MiddleWares
app.use(notFound);
app.use(errorHandler);

const PORT = 5000;

server.listen(PORT, console.log(`Server running  on port ${PORT}`));

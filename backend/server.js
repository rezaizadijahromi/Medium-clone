import express from "express";
import path from "path";
import articleRoutes from "./routes/articleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
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
import { newFollowerRequest } from "./utils/notificatoins.js";
import User from "./models/usersModel.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import googleAuth from "./config/passport.js";

dotenv.config();
connectDB();
googleAuth(passport);

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

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, "reza", function (err, decoded) {
      if (err) {
        console.log(err);
      }
      socket.decoded = decoded;
      next();
    });
  } else {
    console.log("error");
    next(new Error("Authentication error"));
  }
}).on("connection", (socket) => {
  // socket.on("newRequestRecieve", async ({ userIdProfile }) => {
  //   let userId = userIdProfile;
  //   console.log("userIdnew", userId);
  // });

  socket.on("newFollower", async ({ idUser, nameUser, idUserOwn }) => {
    let { success, userId, userOwnId, username } = await newFollowerRequest(
      idUser,
      nameUser,
      idUserOwn,
    );

    const userFind = await User.findById(userId);

    if (success) {
      io.emit("newRequestRecieve", { userId });
    }
  });

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

app.use(passport.initialize());

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/", authRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// MiddleWares
app.use(notFound);
app.use(errorHandler);

const PORT = 5000;

server.listen(PORT, console.log(`Server running  on port ${PORT}`));

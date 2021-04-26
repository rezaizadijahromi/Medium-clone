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

//routers//
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/", testRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// MiddleWares
app.use(notFound);
app.use(errorHandler);

app.set("socketio", io);
console.log("Socket.io listening for connections");

io.on("connect", (socket) => {
  console.log("connected");
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

// Authenticate before establishing a socket connection
// io.use((socket, next) => {
//   const token = socket.handshake.query.token;
//   if (token) {
//     try {
//       const user = jwt.decode(token, process.env.JWT_SECRET);
//       if (!user) {
//         return next(new Error("Not authorized."));
//       }
//       socket.user = user;
//       return next();
//     } catch (err) {
//       next(err);
//     }
//   } else {
//     return next(new Error("Not authorized."));
//   }
// }).on("connection", (socket) => {
//   socket.join(socket.user.id);
//   console.log("socket connected:", socket.id);
// });

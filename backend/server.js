import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Article from "./models/Article.js";
import http from "http";
import { connectDB } from "./config/db.js";
import cors from "cors";
const app = express();
const server = http.createServer(app);
const httpServer = createServer(app);
const io = new Server(httpServer);
import articleHandler from "./articleHandler.js";
connectDB();

app.get("/", (req, res) => {
  res.send("Informatic Backend");
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("getArticles", async () => {
    const articles = await Article.find({});
    socket.emit("articlesList", articles);
  });

  articleHandler(io, socket);
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Article from "./models/Article.js";
import { connectDB } from "./config/db.js";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

import articleHandler from "./components/articleHandler.js";
import articleEditHandler from "./components/articleEditHandler.js";

// Подключаем БД
connectDB();

// Middleware
app.use(cors()); // Разрешаем CORS для запросов с Next.js
app.use(express.json()); // Парсинг JSON, если понадобится для других endpoints

// Главная страница
app.get("/", (req, res) => {
  res.send("Informatic Backend");
});

// Новый REST API endpoint для получения статьи по заголовку
app.get("/articles", async (req, res) => {
  const { title } = req.query; // Получаем параметр title из query string
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const article = await Article.findOne({ title });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Socket.io подключение
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("getArticles", async () => {
    const articles = await Article.find({});
    socket.emit("articlesList", articles);
  });

  articleHandler(io, socket);
  articleEditHandler(io, socket);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

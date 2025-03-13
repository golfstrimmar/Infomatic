import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Article from "./models/Article.js";
import http from "http";
import {connectDB} from "./config/db.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const httpServer = createServer(app);
const io = new Server(httpServer);
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
  socket.on("addArticle", async (payload) => {
    console.log("===Adding new:====", payload);
    
    const { articleData } = payload;
    const data = articleData || payload;// На случай, если структура отличается
    console.log("===Extracted data:====", data);
   
   
    const sanitizedData = {
      category: String(data.category),
      title: String(data.title),
      text: String(data.text),
    };
    try {
      const existingArticle = await Article.findOne({
        title: sanitizedData.title,
      });
      if (existingArticle) {
        const errorMessage = `Article with title "${sanitizedData.title}" already exists`;
        console.log("===Validation error:====", errorMessage);
        return io.emit("erroraddingarticle", errorMessage);
      }
      const newArticle = new Article(sanitizedData);
      console.log("===New Article instance:====", newArticle);
      await newArticle.save();
      console.log("===Article saved:====", newArticle);
      const articles = await Article.find({})
      console.log("===Sending articles list:====", articles);
      io.emit("articlesList", articles);
      io.emit("articleAdded", {message: "Article added successfully",article:newArticle});
    } catch (error) {
      console.error("Error adding Article:", error);
      io.emit("erroraddingarticle", error.message);
    }
  });
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

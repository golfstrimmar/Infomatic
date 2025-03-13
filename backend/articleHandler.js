import { Socket } from "socket.io";
import Article from "./models/Article.js";

export default (io, socket) => {
  socket.on("addArticle", async (payload) => {
    console.log("===Adding new:====", payload);

    const { articleData } = payload;
    const data = articleData || payload;
    console.log("===Extracted data:====", data);

    // Валидация входных данных
    if (!data.category || !data.title || !data.text) {
      const errorMessage = "All fields (category, title, text) are required";
      console.log("===Validation error:====", errorMessage);
      return io.emit("erroraddingarticle", errorMessage);
    }

    const sanitizedData = {
      category: String(data.category),
      title: String(data.title),
      text: String(data.text),
      textenCopy: Array.isArray(data.textenCopy)
        ? data.textenCopy.map(String)
        : [String(data.textenCopy)],
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

      // Отправляем только новую статью, а не весь список
      io.emit("articleAdded", {
        message: "Article added successfully",
        article: newArticle,
      });

      // Если нужен полный список, можно сделать это опционально
      const articles = await Article.find({}).limit(50); // Ограничение для производительности
      console.log("===Sending articles list:====", articles);
      io.emit("articlesList", articles);
    } catch (error) {
      console.error("Error adding Article:", error);
      const errorMessage =
        error.code === 11000
          ? `Article with title "${sanitizedData.title}" already exists`
          : error.message || "Failed to add article";
      io.emit("erroraddingarticle", errorMessage);
    }
  });
};

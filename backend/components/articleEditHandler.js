import { Socket } from "socket.io";
import Article from "../models/Article.js";

export default (io, socket) => {
  socket.on("editArticle", async (payload) => {
    console.log("===Edit:====", payload);

    const { articleData } = payload;
    const data = articleData || payload;
    console.log("===Edit Extracted data:====", data);

    // Валидация входных данных
    if (!data.category || !data.title || !data.text) {
      const errorMessage = "All fields (category, title, text) are required";
      console.log("===Validation error:====", errorMessage);
      return io.emit("errorEditingArticle", errorMessage); // Изменил событие
    }

    const sanitizedData = {
      category: String(data.category),
      tag: String(data.tag || ""), // Добавил значение по умолчанию, если tag отсутствует
      title: String(data.title),
      text: String(data.text),
      textenCopy: Array.isArray(data.textenCopy)
        ? data.textenCopy.map(String)
        : [String(data.textenCopy || "")], // Значение по умолчанию, если textenCopy пустой
    };

    try {
      // Ищем статью по title
      const existingArticle = await Article.findOne({
        title: sanitizedData.title,
      });

      if (!existingArticle) {
        const errorMessage = `Article with title "${sanitizedData.title}" not found`;
        console.log("===Validation error:====", errorMessage);
        return io.emit("errorEditingArticle", errorMessage); 
      }

      
      const updatedArticle = await Article.findOneAndUpdate(
        { title: sanitizedData.title }, // Условие поиска
        { $set: sanitizedData }, // Новые данные
        { new: true } // Возвращаем обновленный документ
      );

      console.log("===Article updated:====", updatedArticle);

      // Отправляем обновленную статью всем клиентам
      io.emit("articleEdited", {
        message: "Article updated successfully",
        article: updatedArticle,
      });
    } catch (error) {
      console.error("Error editing Article:", error);
      const errorMessage =
        error.code === 11000
          ? `Article with title "${sanitizedData.title}" caused a duplicate error`
          : error.message || "Failed to edit article";
      io.emit("errorEditingArticle", errorMessage); // Изменил событие
    }
  });
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Article {
  _id?: string;
  category: string;
  tag?: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticlesState {
  articles: Article[];
}

const initialState: ArticlesState = {
  articles: [],
};

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setArticles(state, action: PayloadAction<Article[]>) {
      state.articles = action.payload;
    },
    setArticle(state, action: PayloadAction<Article>) {
      state.articles = [...state.articles, action.payload];
    },
    editArticle(state, action: PayloadAction<Article>) {
      const updatedArticle = action.payload;
      const index = state.articles.findIndex(
        (article) =>
          article._id === updatedArticle._id ||
          article.title === updatedArticle.title
      );
      if (index !== -1) {
        state.articles[index] = updatedArticle; // Обновляем статью
      } else {
        state.articles.push(updatedArticle); // Если статьи нет, добавляем (опционально)
      }
    },
  },
});

export const { setArticles, setArticle, editArticle } = articlesSlice.actions;
export default articlesSlice.reducer;

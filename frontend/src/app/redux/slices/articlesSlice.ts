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
  },
});

export const { setArticles, setArticle } = articlesSlice.actions;
export default articlesSlice.reducer;

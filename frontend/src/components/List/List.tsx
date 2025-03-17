"use client";
import React, { useState, useEffect } from "react";
import styles from "./List.module.scss";
import Article from "@/components/Article/Article";
import { RootState, useAppSelector } from "@/app/redux/store";

// Интерфейс для статьи из Redux
interface ArticleData {
  _id: string;
  category: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  textenCopy?: string[]; // Опциональный массив строк
}

// Интерфейс для пропсов компонента List
interface ListProps {
  handlerburgerClick: () => void;
  isOpen: boolean;
  curTitle: string;
}

// Компонент List
const List: React.FC<ListProps> = ({
  curTitle,
  handlerburgerClick,
  isOpen,
}) => {
  const articles = useAppSelector(
    (state: RootState) => state.articles.articles
  ) as ArticleData[];
  const [art, setArt] = useState<ArticleData | undefined>(undefined);

  useEffect(() => {
    if (articles && curTitle !== "") {
      const foundArticle = articles.find((foo) => foo.title === curTitle);
      setArt(foundArticle);
    } else {
      setArt(undefined);
    }
  }, [articles, curTitle]);

  return <div className="list">{art && <Article post={art} />}</div>;
};

export default List;

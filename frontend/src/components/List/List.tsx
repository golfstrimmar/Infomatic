"use client";
import React, { useState, useEffect } from "react";
import styles from "./List.module.scss";
import Article from "@/components/Article/Article";
import { RootState, useAppSelector } from "@/app/redux/store";
// =================================

// =================================
interface ListProps {
  handlerburgerClick: () => void;
  isOpen: boolean;
  curTitle: string;
}
// =================================
const List: React.FC<ListProps> = ({ curTitle }) => {
  const articles = useAppSelector((state) => state.articles.articles);
  const [newArticles, setnewArticles] = useState([...articles]);

  useEffect(() => {
    if (articles && curTitle) {
      console.log("<====curTitle====>", curTitle);
      setnewArticles(
        [...articles].filter((foo) => {
          return foo.title === curTitle;
        })
      );
    }
    console.log("<====newArticles====>", newArticles);
  }, [articles, curTitle]);

  return (
    <div className="list ">
      <div className="">
        {newArticles &&
          newArticles.map((el) => {
            return <Article key={el._id} post={el} />;
          })}
      </div>
    </div>
  );
};

export default List;

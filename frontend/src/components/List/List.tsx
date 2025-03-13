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
}
// =================================
const List: React.FC<ListProps> = () => {
  const articles = useAppSelector((state) => state.articles.articles);
  useEffect(() => {
    if (articles) {
      console.log("=====articles=====", articles);
    }
  }, [articles]);
  return (
    <div className="list">
      <div className="bg-gray-200">
        {articles &&
          articles.map((el) => {
            return <Article key={el._id} post={el} />;
          })}
      </div>
    </div>
  );
};

export default List;

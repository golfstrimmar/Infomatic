"use client";
import React, { useState, useEffect } from "react";
import styles from "./Catalog.module.scss";
import List from "@/components/List/List";
import { RootState, useAppSelector } from "@/app/redux/store";
// =================================

// =================================
interface CatalogProps {
  handlerburgerClick: () => void;
  isOpen: boolean;
}
// =================================
const Catalog: React.FC<CatalogProps> = (
  {
    // handlerburgerClick, isOpen
  }
) => {
  const articles = useAppSelector((state) => state.articles.articles);
  const [artCategories, setartCategories] = useState<string[]>([]);
  useEffect(() => {}, []);
  useEffect(() => {
    if (articles) {
      let newArticles = [...articles];
      newArticles = newArticles.map((el) => {
        return el.category;
      });
      newArticles = [...new Set(newArticles)];
      setartCategories(newArticles);
    }
  }, [articles]);

  useEffect(() => {
    if (artCategories.length > 0) {
      console.log("<===artCategories=====>", artCategories);
    }
  }, [artCategories]);

  return (
    <div className="catalog">
      <h1 className="text-3xl font-semibold italic text-gray-800 text-center uppercase">
        catalog
      </h1>
      <div className="list">
        <div className="grid grid-cols-[minmax(300px,max-content)_1fr] pt-2">
          <div className="border border-gray-300 bg-[#ECB920A9] flex flex-col">
            {artCategories &&
              artCategories.map((el, index) => {
                return (
                  <button
                    className="border border-grey-400"
                    type="text"
                    key={index}
                  >
                    {el}
                  </button>
                );
              })}
          </div>
          <div className="bg-gray-200">
            {" "}
            <List />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;

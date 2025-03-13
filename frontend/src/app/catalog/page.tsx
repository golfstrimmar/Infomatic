"use client";
import React, { useState, useMemo } from "react";
import List from "@/components/List/List";
import { useAppSelector } from "@/app/redux/store";

const Catalog: React.FC = () => {
  const articles = useAppSelector((state) => state.articles.articles);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [curTitle, setcurTitle] = useState<string>("");
  const [active, setactive] = useState<string>("");

  const artCategories = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    const categoryMap = articles.reduce((acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = { cat: article.category, titles: [] };
      }
      acc[article.category].titles.push(article.title);
      return acc;
    }, {});
    return Object.values(categoryMap);
  }, [articles]);

  const handlerCatClick = (cat: string) => {
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };
  const handlerClick = (foo: string) => {
    setactive(foo);
    setcurTitle(foo);
  };
  return (
    <div className="catalog">
      {/* <h1 className="text-3xl font-semibold italic text-gray-800 text-center uppercase">
        catalog
      </h1> */}
      <div className="list">
        <div className="grid grid-cols-[minmax(300px,max-content)_60%] pt-2">
          <div className="  flex flex-col">
            {artCategories.map((el) => (
              <React.Fragment key={el.cat}>
                <button
                  className="border border-grey-500 bg-[#6B5F00]  z-3 text-white cursor-pointer"
                  type="button"
                  onClick={() => handlerCatClick(el.cat)}
                >
                  {el.cat}
                </button>
                <div
                  className={`  absolute left-[50%] translate-x-[-50%]  w-[90%]  bg-[#FFFEC9]   ${
                    openCategory === el.cat
                      ? "relative opacity-100 z-10"
                      : "absolute opacity-0  "
                  }`}
                >
                  {el.titles.map((foo, idx) => (
                    <button
                      type="button"
                      className={`cursor-pointer border border-gray-400  w-full ml-auto ${
                        active === foo ? "bg-amber-500" : null
                      }`}
                      key={`${el.cat}-${idx}`}
                      onClick={() => {
                        handlerClick(foo);
                      }}
                    >
                      {foo}
                    </button>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="bg-gray-200">
            <List curTitle={curTitle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;

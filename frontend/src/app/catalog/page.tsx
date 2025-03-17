"use client";
import React, { useState, useMemo, useEffect } from "react";
import List from "@/components/List/List";
import { useAppSelector, RootState } from "@/app/redux/store";
import Edit from "@/assets/svg/edit.svg";
import Link from "next/link";
// Интерфейс статьи из Redux
interface ArticleData {
  _id: string;
  category: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  tag?: string; // Опциональный тег
  textenCopy?: string[]; // Опциональный массив строк из Article
}

// Интерфейс для тега внутри категории
interface Tag {
  tag: string;
  titles: string[];
}

// Интерфейс для категории
interface Category {
  cat: string;
  tags: Tag[];
  titles: string[]; // Заголовки без тегов
}

// Компонент Catalog
const Catalog: React.FC = () => {
  const articles = useAppSelector(
    (state: RootState) => state.articles.articles
  ) as ArticleData[];
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openTag, setOpenTag] = useState<string | null>(null);
  const [curTitle, setCurTitle] = useState<string>("");
  const [active, setActive] = useState<string>("");

  const artCategories = useMemo(() => {
    if (!articles || articles.length === 0) return [] as Category[];

    const categoryMap = articles.reduce(
      (acc: { [key: string]: Category }, article) => {
        if (!acc[article.category]) {
          acc[article.category] = {
            cat: article.category,
            tags: [],
            titles: [],
          };
        }

        if (article.tag) {
          const existingTag = acc[article.category].tags.find(
            (t) => t.tag === article.tag
          );
          if (existingTag) {
            existingTag.titles.push(article.title);
          } else {
            acc[article.category].tags.push({
              tag: article.tag,
              titles: [article.title],
            });
          }
        } else {
          acc[article.category].titles.push(article.title);
        }

        return acc;
      },
      {}
    );

    return Object.values(categoryMap);
  }, [articles]);

  const handlerCatClick = (cat: string): void => {
    setActive("");
    setCurTitle("");
    setOpenCategory((prev) => (prev === cat ? null : cat));
    setOpenTag(null);
  };

  const handlerTagClick = (tag: string): void => {
    setActive("");
    setCurTitle("");
    setOpenTag((prev) => (prev === tag ? null : tag));
  };

  const handlerClick = (title: string): void => {
    setCurTitle("");
    setActive(title);
    setCurTitle(title);
  };
  useEffect(() => {
    console.log("<====active====>", active);
  }, [active]);
  return (
    <div className="catalog">
      <h1 className="text-3xl font-semibold italic text-gray-800 text-center uppercase">
        catalog
      </h1>
      <div className="list">
        <div className="grid grid-cols-[minmax(300px,max-content)_80%] pt-2">
          <div className="flex flex-col w-full">
            {artCategories.map((el) => (
              <div key={el.cat} className="w-full">
                <button
                  className="border bg-[#6B5F00] z-[3] text-white cursor-pointer min-w-[300px] relative"
                  type="button"
                  value={el.cat}
                  onClick={() => handlerCatClick(el.cat)}
                >
                  {el.cat}
                </button>
                <div
                  className={`${
                    openCategory === el.cat
                      ? "flex flex-col items-center w-full"
                      : "hidden"
                  }`}
                >
                  {el.tags && el.tags.length > 0
                    ? el.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center w-full"
                        >
                          <button
                            className="border border-gray-500 w-[97%] z-[3] text-[#6B5F00] cursor-pointer bg-[#d5d24c] block"
                            type="button"
                            value={tag.tag}
                            onClick={() => handlerTagClick(tag.tag)}
                          >
                            {tag.tag}
                          </button>
                          <div
                            className={`${
                              openTag === tag.tag
                                ? "flex flex-col items-center w-full"
                                : "hidden"
                            }`}
                          >
                            {tag.titles.map((title) => (
                              <button
                                key={title}
                                className={`relative  border border-gray-500 w-[95%] z-[3] text-[#6B5F00] cursor-pointer  block  ${
                                  active === title
                                    ? "bg-[#67e4f5]"
                                    : "bg-[#FFFEC9]"
                                }`}
                                type="button"
                                value={title}
                                onClick={() => handlerClick(title)}
                              >
                                {title}
                                <Link
                                  href={`/catalog/${title}`}
                                  className="absolute translate-[-50%] top-[50%] right-[0] z-50 "
                                >
                                  <Edit className="fill-[#6B5F00] w-3 h-3 hover:fill-amber-500 transition-all duration-200"></Edit>
                                </Link>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    : el.titles.map((title) => (
                        <button
                          key={title}
                          className={`relative  border border-gray-500 w-[95%] z-[3] text-[#6B5F00] cursor-pointer  block  ${
                            active === title ? "bg-[#67e4f5]" : "bg-[#FFFEC9]"
                          }`}
                          type="button"
                          onClick={() => handlerClick(title)}
                        >
                          {title}
                          <Link
                            href={`/catalog/${title}`}
                            className="absolute translate-[-50%] top-[50%] right-[0] z-50 "
                          >
                            <Edit className="fill-[#6B5F00] w-3 h-3 hover:fill-amber-500 transition-all duration-200"></Edit>
                          </Link>
                        </button>
                      ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-200">
            <List
              curTitle={curTitle}
              handlerburgerClick={() => {}}
              isOpen={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;

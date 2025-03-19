"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useAppSelector, RootState } from "@/app/redux/store";
import List from "@/components/List/List";
import { motion, AnimatePresence } from "framer-motion"; // Импортируем framer-motion
import Link from "next/link";
import Edit from "@/assets/svg/edit.svg";
// Интерфейсы
interface ArticleData {
  _id: string;
  category: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  tag?: string;
  textenCopy?: string[];
}

interface Tag {
  tag: string;
  titles: string[];
}

interface Category {
  cat: string;
  tags: Tag[];
  titles: string[];
}

const Catalog: React.FC = () => {
  const articles = useAppSelector(
    (state: RootState) => state.articles.articles
  ) as ArticleData[];

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openTag, setOpenTag] = useState<string | null>(null);
  const [curTitle, setCurTitle] = useState<string>("");

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

  const handleClick = useCallback(
    (level: "category" | "tag" | "title", value: string) => {
      if (level === "category") {
        setOpenCategory((prev) => (prev === value ? null : value));
        setOpenTag(null);
        setCurTitle("");
      } else if (level === "tag") {
        setOpenTag((prev) => (prev === value ? null : value));
        setCurTitle("");
      } else if (level === "title") {
        setCurTitle(value);
      }
    },
    []
  );

  return (
    <div className="catalog">
      <h1 className="text-3xl font-semibold italic text-gray-800 text-center uppercase">
        Catalog
      </h1>
      <div className="grid grid-cols-[minmax(300px,max-content)_80%] pt-2">
        <div className="flex flex-col w-full">
          {artCategories.map((el) => (
            <div key={el.cat} className="w-full">
              <button
                className={`border z-[3] text-white cursor-pointer min-w-[300px] relative transition-colors duration-300 ease-in-out ${
                  openCategory === el.cat ? "bg-[#8B7F00]" : "bg-[#6B5F00]"
                }`}
                onClick={() => handleClick("category", el.cat)}
              >
                {el.cat}
              </button>
              {/* Анимация для уровня категории */}
              <AnimatePresence>
                {openCategory === el.cat && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center w-full overflow-hidden "
                  >
                    {el.tags && el.tags.length > 0
                      ? el.tags.map((tag) => (
                          <div
                            key={tag.tag}
                            className="flex flex-col items-center w-full"
                          >
                            <button
                              className={`border border-gray-500 w-[97%] z-[3] text-[#6B5F00] cursor-pointer bg-[#d5d24c] block transition-colors duration-300 ease-in-out ${
                                openTag === tag.tag
                                  ? "bg-[#e0f567]"
                                  : "bg-[#FFFEC9]"
                              }`}
                              type="button"
                              onClick={() => handleClick("tag", tag.tag)}
                            >
                              {tag.tag}
                            </button>
                            {/* Анимация для уровня тегов */}
                            <AnimatePresence>
                              {openTag === tag.tag && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col items-center w-full overflow-hidden"
                                >
                                  {tag.titles.map((title) => (
                                    <button
                                      key={title}
                                      className={`relative border border-gray-500 w-[95%] z-[3] text-[#6B5F00] cursor-pointer block transition-colors duration-300 ease-in-out ${
                                        curTitle === title
                                          ? "bg-[#fafce4]"
                                          : "bg-[#fdf8ac]"
                                      }`}
                                      type="button"
                                      onClick={() =>
                                        handleClick("title", title)
                                      }
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
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))
                      : el.titles.map((title) => (
                          <button
                            key={title}
                            className={`relative border border-gray-500 w-[95%] z-[3] text-[#6B5F00] cursor-pointer block transition-colors duration-300 ease-in-out ${
                              curTitle === title
                                ? "bg-[#fafce4]"
                                : "bg-[#fdf8ac]"
                            }`}
                            type="button"
                            onClick={() => handleClick("title", title)}
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
                  </motion.div>
                )}
              </AnimatePresence>
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
  );
};

export default Catalog;

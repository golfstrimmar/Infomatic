"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Edit from "@/assets/svg/edit.svg";
import { useState, useCallback } from "react";

interface Tag {
  tag: string;
  titles: string[];
}

interface Category {
  cat: string;
  tags: Tag[];
  titles: string[];
}

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

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openTag, setOpenTag] = useState<string | null>(null);
  const articles = useSelector(
    (state: RootState) => state.articles.articles
  ) as ArticleData[];

  // ==================
  const artCategories = articles.reduce(
    (acc: { [key: string]: Category }, article) => {
      if (!acc[article.category]) {
        acc[article.category] = { cat: article.category, tags: [], titles: [] };
      }
      if (article.tag) {
        const tag = acc[article.category].tags.find(
          (t) => t.tag === article.tag
        );
        if (tag) tag.titles.push(article.title);
        else
          acc[article.category].tags.push({
            tag: article.tag,
            titles: [article.title],
          });
      } else {
        acc[article.category].titles.push(article.title);
      }
      return acc;
    },
    {}
  );

  const handleClick = useCallback(
    (level: "category" | "tag", value: string) => {
      if (level === "category") {
        setOpenCategory((prev) => (prev === value ? null : value));
        setOpenTag(null);
      } else if (level === "tag") {
        setOpenTag((prev) => (prev === value ? null : value));
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
          {Object.values(artCategories).map((el) => (
            <div key={el.cat} className="w-full">
              <button
                className={`border z-[3] text-white cursor-pointer min-w-[300px] relative transition-colors duration-300 ease-in-out ${
                  openCategory === el.cat ? "bg-[#8B7F00]" : "bg-[#6B5F00]"
                }`}
                onClick={() => handleClick("category", el.cat)}
              >
                {el.cat}
              </button>
              <AnimatePresence>
                {openCategory === el.cat && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center w-full overflow-hidden"
                  >
                    {el.tags.map((tag) => (
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
                          onClick={() => handleClick("tag", tag.tag)}
                        >
                          {tag.tag}
                        </button>
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
                                <div key={title} className="relative w-[95%]">
                                  <Link
                                    href={`/catalog/${encodeURIComponent(
                                      title
                                    )}`}
                                    className="border border-gray-500 w-full text-[#6B5F00] block transition-colors duration-300 ease-in-out bg-[#fdf8ac] hover:bg-[#fafce4]  text-center"
                                  >
                                    {title}
                                  </Link>
                                  <Link
                                    href={`/edit/${encodeURIComponent(title)}`}
                                    className="absolute translate-y-[-50%] top-[50%] right-2 z-50"
                                  >
                                    <Edit className="fill-[#6B5F00] w-3 h-3 hover:fill-amber-500 transition-all duration-200" />
                                  </Link>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                    {el.titles.map((title) => (
                      <div key={title} className="relative w-[95%]">
                        <Link
                          href={`/catalog/${encodeURIComponent(title)}`}
                          className="border border-gray-500 w-full text-[#6B5F00] block transition-colors duration-300 ease-in-out bg-[#fdf8ac] hover:bg-[#fafce4] text-center"
                        >
                          {title}
                        </Link>
                        <Link
                          href={`/edit/${encodeURIComponent(title)}`}
                          className="absolute translate-y-[-50%] top-[50%] right-2 z-50"
                        >
                          <Edit className="fill-[#6B5F00] w-3 h-3 hover:fill-amber-500 transition-all duration-200" />
                        </Link>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="bg-gray-200 p-4">{children}</div>
      </div>
    </div>
  );
}

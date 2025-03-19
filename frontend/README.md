Username
yushinbox
Password
oWzeXEp2gtCWhsS0

mongodb+srv://yushinbox:oWzeXEp2gtCWhsS0@clusterinformatic.qz73m.mongodb.net/informatic?retryWrites=true&w=majority






"use client";
import React, { useState, useMemo, useCallback } from "react";
import { useAppSelector, RootState } from "@/app/redux/store";
import List from "@/components/List/List";
import { motion, AnimatePresence } from "framer-motion"; // Импортируем framer-motion
import Link from "next/link";
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
                                ? "bg-[#f5cf67]"
                                : "bg-[#FFFEC9]"
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







This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

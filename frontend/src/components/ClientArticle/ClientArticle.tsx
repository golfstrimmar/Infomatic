// // /components/ClientArticle.tsx

"use client";
import React, { useState, useEffect } from "react";
import styles from "./Article.module.scss";
import Copy from "@/components/Copy/Copy";

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
const ClientArticle = ({ initialArticle }: { initialArticle: ArticleData }) => {
  return (
    <div className="border border-solid border-[#546e7a] bg-[#a8d6f9b3] rounded">
      <h1 className="text-3xl font-semibold italic text-gray-800 text-center">
        {initialArticle.title}
      </h1>
      <div className="text-grey flex flex-col bg-[#ECEFF1]">
        {initialArticle.textenCopy?.map((foo, idx) => (
          <Copy text={foo} key={idx} />
        ))}
      </div>
      <div className="text-grey p-4">{initialArticle.text}</div>
    </div>
  );
};

export default ClientArticle;

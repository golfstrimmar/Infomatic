"use client";
import React, { useState, useEffect } from "react";
import styles from "./Article.module.scss";
import Copy from "@/components/Copy/Copy";

interface PostProps {
  post: {
    _id: string;
    category: string;
    title: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    textenCopy?: string[];
  };
}

const Article: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="border border-solid border-[#546e7a] bg-[#a8d6f9b3] rounded">
      <div className="text-grey flex flex-col bg-[#ECEFF1]">
        {post.textenCopy?.map((foo, idx) => (
          <Copy text={foo} key={idx} />
        ))}
      </div>
      <div className="text-grey p-4">{post.text}</div>
    </div>
  );
};

export default Article;

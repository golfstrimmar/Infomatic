"use client";
import React, { useState, useEffect } from "react";
import styles from "./Article.module.scss";
// =================================
interface PostProps {
  _id: string;
  category: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

// =================================
const Article: React.FC<PostProps> = ({ post }) => {
  useEffect(() => {
    if (post) {
      console.log("=====post=====", post);
    }
  }, [post]);
  return (
    <div className="border border-solid border-gray-400">
      <h1 className="text-3xl font-semibold italic text-gray-800 text-center uppercase">
        {post.title}
      </h1>
      <div className="text-grey"> {post.category}</div>
      <div className="text-grey"> {post.text}</div>
    </div>
  );
};

export default Article;

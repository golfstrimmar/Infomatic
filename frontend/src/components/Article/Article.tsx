"use client";
import React, { useState, useEffect } from "react";
import styles from "./Article.module.scss";
import Copy from "@/components/Copy/Copy";
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
    <div className="border border-solid border-[#546e7a] bg-[#a8d6f9b3] rounded">
      {/* <h1 className="text-1xl font-semibold italic text-gray-800 text-center ">
        {post.title}
      </h1> */}
      <div className="text-grey flex flex-col bg-[#ECEFF1]">
        {post.textenCopy.map((foo, idx) => {
          return <Copy text={`${foo}`} key={idx}></Copy>;
        })}
      </div>
      {/* <div className="text-grey"> {post.category}</div> */}
      <div className="text-grey">{post.text}</div>{" "}
    </div>
  );
};

export default Article;

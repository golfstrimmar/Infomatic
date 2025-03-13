"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddArticle.module.scss";
import Input from "@/components/ui/Input/Input";
import axios from "axios";
import ImagesIcon from "@/assets/svg/images.svg";
import Button from "@/components/ui/Button/Button";
import ModalMessage from "@/components/ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppSelector } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { setArticles } from "@/app/redux/slices/articlesSlice";
// =================================

// =================================

// =================================
const AddArticle: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const socket = useAppSelector((state: RootState) => state.socket.socket);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  // =================================
  const resetForm = () => {
    setTitle("");
    setText("");
    setCategory("");
    setSuccessMessage("");
    setOpenModalMessage(false);
  };
  // =================================

  // =================================
  useEffect(() => {
    if (socket) {
      const handleArticleAdded = (data: { message: string; article?: any }) => {
        console.log(data.message);
        socket.emit("getArticles");
        setSuccessMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
          resetForm();
          router.replace("/catalog");
        }, 2000);
      };

      const handleErrorAddingArticle = (errorMessage: string) => {
        setSuccessMessage(errorMessage);
        setOpenModalMessage(true);
        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
        }, 2000);
      };

      socket.on("articleAdded", handleArticleAdded);
      socket.on("erroraddingarticle", handleErrorAddingArticle);

      // Очистка при размонтировании
      return () => {
        socket.off("articleAdded", handleArticleAdded);
        socket.off("erroraddingarticle", handleErrorAddingArticle);
      };
    }
  }, [socket, setSuccessMessage, setOpenModalMessage, resetForm, router]);
  // =================================
  const CategoryHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCategory(e.target.value);
  }; // =================================
  const TitleHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(e.target.value);
  };

  // =================================
  const TextHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
  };

  // =================================
  const handleSubmit = async (
    e?:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!title || !text) {
      setSuccessMessage("Title, Text , Category is required!");
      setOpenModalMessage(true);
      setTimeout(() => {
        setOpenModalMessage(false);
      }, 2000);
      return;
    }

    try {
      const articleData = {
        title,
        text,
        category,
      };
      console.log("=====articleData=====", articleData);
      if (socket) {
        socket.emit("addArticle", { articleData });
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };
  // =================================

  return (
    <form
      className={`${styles.addauctionform} flex flex-col gap-2 max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4`}
    >
      <ModalMessage message={successMessage} open={openModalMessage} />
      <h2 className="text-2xl font-semibold italic text-gray-800">Add Form</h2>
      <h3 className="text-gray-700 font-bold italic ">
        Category:
        {category}
      </h3>
      <Input
        typeInput="text"
        data="Category"
        value={category}
        onChange={CategoryHandler}
      />
      <h3 className="text-gray-700 font-bold italic ">
        Title:
        {title}
      </h3>
      <Input
        typeInput="text"
        data="Title"
        value={title}
        onChange={TitleHandler}
      />
      <h3 className="text-gray-700 font-bold  italic ">Text: {text}</h3>
      <Input typeInput="text" data="Text" value={text} onChange={TextHandler} />
      <Button onClick={handleSubmit} children="Add Auction" />
    </form>
  );
};

export default AddArticle;

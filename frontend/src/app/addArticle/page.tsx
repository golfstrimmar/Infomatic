"use client";
import React, { useState, useEffect } from "react";
import styles from "./AddArticle.module.scss";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import ModalMessage from "@/components/ModalMessage/ModalMessage";
import { useSelector, useDispatch } from "react-redux";
import { RootState, useAppSelector } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { setArticle } from "@/app/redux/slices/articlesSlice";
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
  const [tag, setTag] = useState<string>("регистрация");
  const [text, setText] = useState<string>("  ");
  const [category, setCategory] = useState<string>("СЕРВЕР Next");
  const [textToCopy, settextToCopy] = useState<string>("");
  const [textenCopy, settextenCopy] = useState<string[]>([]);
  const [errors, seterrors] = useState<string>("");
  // =================================
  const resetForm = () => {
    setTitle("");
    setText("");
    setCategory("");
    settextenCopy([]);
    settextToCopy("");
    setSuccessMessage("");
    setOpenModalMessage(false);
  };
  // =================================

  // =================================
  useEffect(() => {
    if (socket) {
      const handleArticleAdded = (data: { message: string; article?: any }) => {
        dispatch(setArticle(data.article));
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
  const TagHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTag(e.target.value);
  };

  // =================================
  const TextHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(e.target.value);
  };

  // =================================
  const TextToCopyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    settextToCopy(e.target.value);
  };
  // =================================
  const TextToCopyHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (textToCopy.length > 0) {
      settextenCopy((prev) => {
        return [...prev, textToCopy];
      });
      settextToCopy("");
    } else {
      seterrors("value muss sein");
      setTimeout(() => {
        seterrors("");
      }, 1000);
    }
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
        category,
        tag,
        title,
        text,
        textenCopy,
      };
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
      className={`${styles.addauctionform} flex flex-col  max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4`}
    >
      <ModalMessage message={successMessage} open={openModalMessage} />
      {/* <h2 className="text-2xl font-semibold italic text-gray-800">Add Form</h2> */}
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
        Tag:
        {tag}
      </h3>
      <Input typeInput="text" data="Tag" value={tag} onChange={TagHandler} />

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
      <h3 className="text-gray-700 font-bold  italic ">Text: </h3>
      <Input
        typeInput="textarea"
        data="Text"
        value={text}
        onChange={TextHandler}
      />

      {/* ================== */}
      <h3 className="text-gray-700 font-bold  italic ">Texten copy:</h3>
      {textenCopy &&
        textenCopy.map((foo, idx) => {
          // return <p key={idx}>{foo}</p>;

          return (
            <div key={idx} className="flex align-middle gap-1">
              <button
                type="button"
                className="border border-solid border-[#546e7a] bg-[#a8d6f9b3] rounded p-2 cursor-pointer"
                onClick={(e) => {
                  settextToCopy(foo);
                  settextenCopy((prev) => {
                    return prev.filter((f) => f !== foo);
                  });
                }}
                value={foo}
              >
                {foo}
              </button>
            </div>
          );
        })}
      {/* ================== */}

      {/* <h3 className="text-gray-700 font-bold  italic ">
        Text to copy: {textToCopy}
      </h3> */}
      <h5 className="text-red-900">{errors}</h5>
      <div className="flex align-middle gap-1">
        <Input
          typeInput="textarea"
          data="Text to copy"
          value={textToCopy}
          onChange={TextToCopyChange}
        />
        <button
          type="button"
          className="cursor-pointer border border-grey-300 bg-blue-600  text-blue-50 w-8 h-8  rounded-full"
          onClick={(e) => {
            TextToCopyHandler(e);
          }}
        >
          +
        </button>
      </div>
      {/* ================== */}

      <Button onClick={handleSubmit} children="Add" />
    </form>
  );
};

export default AddArticle;

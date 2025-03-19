"use client";
import React, { useState, useEffect } from "react";
import ModalMessage from "@/components/ModalMessage/ModalMessage";
import Button from "@/components/ui/Button/Button";
import { useDispatch } from "react-redux";
import { RootState, useAppSelector } from "@/app/redux/store";
import { useRouter, useParams } from "next/navigation";
import { AppDispatch } from "@/app/redux/store"; // Предполагается, что экспортирован из store
import Input from "@/components/ui/Input/Input";
import { editArticle } from "@/app/redux/slices/articlesSlice";
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

const EditArticle: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { title } = useParams<{ title: string }>();
  const socket = useAppSelector((state: RootState) => state.socket.socket);
  const articles = useAppSelector(
    (state: RootState) => state.articles.articles
  ) as ArticleData[];
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [titleEdit, setTitleEdit] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [textToCopy, setTextToCopy] = useState<string>("");
  const [textenCopy, setTextenCopy] = useState<string[]>([]);
  const [errors, setErrors] = useState<string>("");

  useEffect(() => {
    if (title) {
      const decodedTitle = decodeURIComponent(title);
      setTitleEdit(decodedTitle);
      const newArticles = [...articles];
      const foundArticle = newArticles.find(
        (foo) => foo.title === decodedTitle
      );
      if (foundArticle) {
        setCategory(foundArticle.category);
        setTag(foundArticle.tag || "");
        setText(foundArticle.text);
        setTextenCopy(foundArticle.textenCopy || []);
      }
    }
  }, [title]);

  // const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  //   // handlerburgerClick(); // Раскомментируйте и добавьте логику
  // };
  const resetForm = () => {
    setTitleEdit("");
    setText("");
    setCategory("");
    setTextenCopy([]);
    setTextToCopy("");
    setSuccessMessage("");
    setOpenModalMessage(false);
  };
  // =================================

  // =================================
  useEffect(() => {
    if (socket) {
      const handleArticleEdited = (data: {
        message: string;
        article?: any;
      }) => {
        if (data.article) {
          dispatch(editArticle(data.article));
        }
        // socket.emit("getArticles");
        setSuccessMessage(data.message);
        setOpenModalMessage(true);
        setTimeout(() => {
          setOpenModalMessage(false);
          resetForm();
          router.replace("/catalog");
        }, 2000);
      };

      const handleErrorEditingArticle = (errorMessage: string) => {
        setSuccessMessage(errorMessage);
        setOpenModalMessage(true);
        setTimeout(() => {
          setSuccessMessage("");
          setOpenModalMessage(false);
        }, 2000);
      };

      socket.on("articleEdited", handleArticleEdited);
      socket.on("errorEditingArticle", handleErrorEditingArticle);

      // Очистка при размонтировании
      return () => {
        socket.off("articleAdded", handleArticleEdited);
        socket.off("errorEditingArticle", handleErrorEditingArticle);
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
    setTitleEdit(e.target.value);
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
    setTextToCopy(e.target.value);
  };
  // =================================
  const TextToCopyHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (textToCopy.length > 0) {
      setTextenCopy((prev) => {
        return [...prev, textToCopy];
      });
      setTextToCopy("");
    } else {
      setErrors("value muss sein");
      setTimeout(() => {
        setErrors("");
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

    if (!titleEdit || !text) {
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
        title: titleEdit,
        text,
        textenCopy,
      };
      if (socket) {
        socket.emit("editArticle", { articleData });
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };
  // =================================
  return (
    <div className="editarticle">
      <div>
        <h2 className="">edit article: {titleEdit}</h2>
        <form
          className={` flex flex-col  max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4`}
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
          <Input
            typeInput="text"
            data="Tag"
            value={tag}
            onChange={TagHandler}
          />

          <h3 className="text-gray-700 font-bold italic ">
            Title:
            {titleEdit}
          </h3>
          <Input
            typeInput="text"
            data="Title"
            value={titleEdit}
            onChange={TitleHandler}
          />
          {/* <h3 className="text-gray-700 font-bold  italic ">Text: {text}</h3> */}
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
              return (
                <div key={idx} className="flex align-middle gap-1">
                  <button
                    type="button"
                    className="border border-solid border-[#546e7a] bg-[#a8d6f9b3] rounded p-2 cursor-pointer"
                    onClick={(e) => {
                      setTextToCopy(foo);
                      setTextenCopy((prev) => {
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

          <Button onClick={handleSubmit} children="Edit" />
        </form>
      </div>
    </div>
  );
};

export default EditArticle;

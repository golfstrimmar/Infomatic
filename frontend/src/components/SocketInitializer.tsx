"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { setSocket, disconnectSocket } from "@/app/redux/slices/socketSlice";
import { setArticles } from "@/app/redux/slices/articlesSlice";
import { RootState, useAppSelector } from "@/app/redux/store";
// =======================

// =======================
interface Article {
  _id: string;
  category: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

const SocketInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const articles = useAppSelector(
    (state: RootState) => state.articles.articles
  );
  useEffect(() => {
    const serverUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const socket = io(serverUrl, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to server with id:", socket.id);
      dispatch(setSocket(socket));

      if (!articles.length > 0) {
        socket.emit("getArticles");
        socket.on("articlesList", (articles) => {
          console.log("Received articles from server:", articles);
          dispatch(setArticles(articles));
        });
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      dispatch(disconnectSocket());
    });

    return () => {
      socket.disconnect();
      dispatch(disconnectSocket());
    };
  }, [dispatch]);

  return null;
};

export default SocketInitializer;

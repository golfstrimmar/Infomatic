"use client";
import React, { useState } from "react";
import styles from "./Copy.module.scss";
import Input from "@/components/ui/Input/Input";
interface CopyProps {
  text: string;
}

const Copy: React.FC<CopyProps> = ({ text }) => {
  const [activ, setactiv] = useState<boolean>(false);
  const handlerCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } finally {
      setactiv(true);
      setTimeout(() => {
        setactiv(false);
      }, 1000);
    }
  };
  return (
    <textarea
      rows="5"
      name="Texttocopy"
      value={text}
      onClick={handlerCopy}
      className={`${
        activ ? "bg-amber-400" : "bg-amber-200"
      } cursor-pointer border rounded  px-1   border-amber-900 transition-colors duration-300 ease-in-out`}
      required
      readOnly
    />
  );
};

export default Copy;

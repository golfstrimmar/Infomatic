"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Burger from "../ui/Burger/Burger";
import styles from "./Navbar.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
interface User {
  _id?: string;
  userName: string;
  email: string;
  avatar: string;
  createdAt: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-700 p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          A
        </Link>
        <Burger handlerburgerClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
        <ul
          className={`${styles["navbar-menu"]} ${
            isOpen ? styles.run : ""
          }  flex  gap-2`}
        >
          <li>
            <Link
              href="/"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/catalog"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Catalog
            </Link>
          </li>
          <li>
            <Link
              href="/addArticle"
              className="text-white hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Add
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

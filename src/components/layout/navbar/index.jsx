"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "./dropdown";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Login from "../../../pages/loginPage/login";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const links = [
  {
    title: "Home",
    href: "/",
  },

  {
    title: "About us",
    href: "/about-us",
  },

  {
    title: "Marketplace",
    href: "/marketplace",
  },
];

const Logos = () => {
  return (
    <div className="flex gap-10 items-center ">
      <a href="/">
        <motion.img
          src="/supaLogo.png"
          className="w-[60px] lg:w-[80px]  object-contain lg:mt-[10px]"
        />
      </a>
      <a href="/">
        <motion.img
          src="/public/itfLogo.jfif"
          className="w-[40px]   object-contain lg:mt-[10px]"
        />
      </a>
      <a href="/">
        <motion.img
          src="/public/fgLogo.png"
          className="w-[60px] lg:w-[60px]  object-contain lg:mt-[10px]"
        />
      </a>
    </div>
  );
};
function NavBar() {
  const [showMenu, setShowMenu] = React.useState(false);

  const openMenu = () => {
    setShowMenu(!showMenu);
  };

  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      setIsTop(scrollTop < 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`pt-[5px] ${
        !isTop ? "fixed z-[999] shadow-lg " : "relative"
      } widow-main  ${
        !showMenu ? "bg-white" : "bg-[#000000]/90"
      } pb-[15px] w-full px-[2rem]`}
    >
      <AnimatePresence>
        {showMenu ? (
          <motion.div
            initial={{ scale: 0, rotate: "280deg", opacity: 0 }}
            animate={{ scale: 1, rotate: "0deg", opacity: 1 }}
            exit={{ scale: 0, rotate: "280deg", opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="py-[20px] w-full  bg-[#000000]/90 fixed  left-0 h-[calc(100vh)] top-[55px] sm:h-[calc(100vh-55px)]  z-[12] font-[600]"
          >
            <Dropdown handleClose={() => setShowMenu(false)} links={links} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="widow-inner">
        <div className={`flex items-start justify-between w-full`}>
          {showMenu ? "" : <Logos />}
          <div className="hidden items-center gap-[20px] pt-[10px] lg:flex">
            {links.map((x) => {
              const active = false;

              if (x.children?.length) {
                const active = false;
                return (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <a
                        href="/#"
                        className={`hover:underline text-[#1e412a] cursor-pointer text-[17px] ${
                          active ? "underline font-[600]" : "font-[400]"
                        } flex items-center gap-1`}
                      >
                        <span>{x.title}</span>
                        <ChevronDownIcon />
                      </a>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[300px] pt-[30px]">
                      <DropdownMenuGroup>
                        {x.children.map((child) => {
                          return (
                            <a href={child.href}>
                              <DropdownMenuItem>{child.title}</DropdownMenuItem>
                            </a>
                          );
                        })}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <a
                  href={x.href}
                  className={`hover:underline text-[#1e412a] cursor-pointer text-[20px]  ${
                    active ? "underline font-[600]" : "font-[400]"
                  }`}
                >
                  {x.title}
                </a>
              );
            })}

            <Link to="/login">
              <button className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
                Login
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-[20px] pt-[10px] lg:hidden">
            <motion.button
              onClick={openMenu}
              whileHover="animate"
              className={`text-[#1e412a]  items-center gap-3 cursor-pointer relative z-[11] flex }`}
            >
              {showMenu ? (
                <motion.img
                  src={
                    showMenu
                      ? "/icons/close-white.svg"
                      : "/icons/menu_black.svg"
                  }
                  className="w-[30px] h-[30px]"
                  variants={{
                    animate: {
                      scale: 1.2,
                      rotate: "4deg",
                    },
                  }}
                />
              ) : (
                <motion.img
                  src={
                    showMenu
                      ? "/icons/close-white.svg"
                      : "/icons/menu_black.svg"
                  }
                  className="w-[30px] h-[30px]"
                  variants={{
                    animate: {
                      scale: 1.2,
                      rotate: "4deg",
                    },
                  }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;

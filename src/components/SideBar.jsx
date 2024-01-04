import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Overzicht quizzen", src: "Overview", link: "dashboard"},
    { title: "Quizzen beheren", src: "Create", link: "dashboard/quiz" },
    { title: "Profiel", src: "User", gap: true, link: "dashboard"},
    { title: "Instellingen", src: "Setting", gap2: true, link: "dashboard" },
    { title: "Uitloggen", src: "Logout", gap3: true, link: "uitloggen"},
  ];

  return (
    <div className="flex sidebar-container z-50">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-indigo-900 h-screen p-5  pt-8 relative duration-300`}
      >
        <img
          src="/images/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
         border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src="vite.svg"
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Mahoot
          </h1>
        </div>
        <ul className="pt-10">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
            ${Menu.gap ? "fixed bottom-20" : ""} ${Menu.gap2 ? "fixed bottom-10" : ""} ${Menu.gap3 ? "fixed bottom-0" : ""} ${index === 0 && "bg-light-white"} `}
            >
              <img src={`/images/${Menu.src}.png`} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                <Link to={`/${Menu.link}`} className="font-medium hover:underline">{Menu.title}</Link>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;

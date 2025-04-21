import React from "react";

interface MobileSideBarProps {
  sidebarButtons?: React.ReactNode;
  navList: {
    name: string;
    icon: JSX.Element;
    link: string;
  }[];
  title?: string;
  date: React.ReactNode;
  time: React.ReactNode;
  open: boolean;
}

const MobileSideBar = ({
  sidebarButtons,
  navList,
  title,
  date,
  time,
  open,
}: MobileSideBarProps) => {
  const path = window.location.pathname; // This is the path that will be used to get the current path

  return (
    <div
      className={`w-[80%] sm:hidden flex flex-col h-[calc(100vh-52px)] ${
        open ? "translate-x-0" : "translate-x-[200vh]"
      } transition-all duration-500 ease-in-out bg-white fixed top-[52px] right-0 text-[#292929] shadow-lg drop-shadow-lg z-[1000]`}
    >
      <div className="w-full flex flex-col items-start justify-end h-[120px] bg-primary shadow-md px-8 py-2 relative">
        <h2 className="text-[20px] font-bold ">{title ? title : ""}</h2>
        <div className="flex flex-row justify-end items-center gap-2">
          {time}
          <p>•</p>
          {date}
        </div>
      </div>
      <div className="p-4 flex flex-col w-full gap-4 h-full overflow-y-auto">
        {navList.map((nav, index) => {
          let isActive = path === nav.link;
          return (
            <a
              href={nav.link}
              key={index}
              className={`w-full flex flex-row justify-start items-center gap-4 h-[50px] ${
                isActive
                  ? "bg-[#65217c81] text-white shadow-md"
                  : "text-gray-700"
              } rounded-md p-4`}
            >
              <div className="flex items-center justify-center size-[24px]">
                {/* Corrected this line */}
                <span className={`w-6 h-6 ${isActive ? "invert" : ""}`}>
                  {" "}
                  {nav.icon}
                </span>
              </div>
              <p className="text-[16px] font-medium">{nav.name}</p>
            </a>
          );
        })}
        {sidebarButtons}
      </div>
    </div>
  );
};

export default MobileSideBar;

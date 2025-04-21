import { useEffect, useRef, useState } from "react";
import { signOutIcon, userLineIcon } from "../data";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [viewSwitch, setViewSwitch] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setViewSwitch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewSwitch]);
  return (
    <>
      <div
        onClick={() => {
          setViewSwitch(!viewSwitch);
        }}
        className="flex items-center justify-center relative cursor-pointer group "
      >
        <img src={userLineIcon} alt="icon" className="size-[24px] 2" />

        <div
          ref={dropDownRef}
          className={`absolute top-[105%] right-0 w-[220px] bg-white rounded-md shadow-md drop-shadow-md p-1 -translate-y-1
                ${
                  viewSwitch
                    ? "opacity-100 translate-y-1"
                    : "opacity-0 pointer-events-none"
                } transition-all duration-300 ease-in-out flex flex-col gap-2
                `}
        >
          <div className="w-full flex flex-row gap-2 items-center hover:bg-gray-200 p-2">
            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
              <img src={userLineIcon} alt="icon" className="size-[16px]" />
            </div>
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold">Main Admin</p>
              <p className="text-[10px]">Admin</p>
            </div>
          </div>
          <div
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("userRole");
              navigate("/login");
            }}
            className="flex flex-row gap-4 items-center hover:bg-gray-200 p-2"
          >
            <img src={signOutIcon} alt="icon" className="size-[20px]" />
            <p className="text-[12px] font-semibold">Sign Out</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

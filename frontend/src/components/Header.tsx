import { useEffect, useState } from "react";
import { closeIcon, menuIcon } from "../data";
import axios from "axios";
import logo from "../assets/logo/z logo.png"; // Import your logo image here

interface HeaderProps {
  title?: string;
  leftChildren?: React.ReactNode;
  onMenuOpen?: (value: boolean) => void;
  notificationSmallDevice?: React.ReactNode;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Header = ({
  title,
  leftChildren,
  onMenuOpen,
  notificationSmallDevice,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const token = localStorage.getItem("accessToken");
  const path = window.location.pathname;

  useEffect(() => {
    // If there's a token, check the connection status
    if (token) {
      // Fetch the connection status from API if token is available
      axios
        .get(`${API_URL}/admin/is-connected`, {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the request headers
        })
        .then((response) => {
          setIsConnected(response.data.isConnected); // Assuming response has isConnected property
        })
        .catch((error) => {
          console.error("Error fetching connection status:", error);
          setIsConnected(false); // Assume disconnected if error occurs
        });
    } else {
      setIsConnected(false); // If no token, assume not connected
    }
  }, [token]);

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between p-4 bg-gray-100 shadow-md max-h-[64px] font-inter">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="logo"
            className={`w-auto h-14 sm:w-auto sm:h-14 rounded-xl ${
              path.startsWith("/biz/manage") ? "h-5 sm:h-8" : ""
            }`}
          />

          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <img
              src="https://img.icons8.com/ios/50/refresh.png"
              alt="refresh"
              className="w-5 h-5"
            />

            <span>
              {isConnected === null
                ? "Loading..."
                : isConnected
                ? "Connected"
                : "Not Connected"}
            </span>

            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected === null
                  ? "bg-gray-300"
                  : isConnected
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
          </div>
        </div>

        <div className="hidden sm:block">
          <h1 className="text-[#292929] font-bold text-4xl">{title}</h1>
        </div>
        <div className="sm:flex flex-row gap-x-5 items-center hidden">
          {leftChildren}
        </div>
        <div className="flex sm:hidden flex-row gap-3">
          {notificationSmallDevice}
          <div
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (onMenuOpen) {
                onMenuOpen(!isMenuOpen);
              }
            }}
            className="flex items-center justify-center cursor-pointer"
          >
            {isMenuOpen ? (
              <img src={closeIcon} alt="menu" className="w-5 h-5" />
            ) : (
              <img src={menuIcon} alt="menu" className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

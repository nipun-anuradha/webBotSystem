import { useEffect, useState } from "react";
import { signOutIcon } from "../data";
import NotificationBar from "../components/NotificationBar";
import MobileSideBar from "../components/MobileSideBar";
import CurrentDate from "../components/CurrentDate";
import CurrentTime from "../components/CurrentTime";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { bellIcon } from "../assets/icons";
import UserProfile from "../components/UserProfile";
import { IoHome, IoLogoWhatsapp, IoSettings } from "react-icons/io5";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { PiImageSquareDuotone, PiPersonArmsSpreadBold } from "react-icons/pi";

const AdminDashboardLayout = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const navigate = useNavigate();

  const navList = [
    { name: "Home", icon: <IoHome />, link: "/Admin/adminhome" },
    { name: "Items", icon: <PiPersonArmsSpreadBold />, link: "/Admin/item" },
    { name: "Images", icon: <PiImageSquareDuotone />, link: "/Admin/images" },
    { name: "Settings", icon: <IoSettings />, link: "/Admin/setting" },
    { name: "Wbot Clients", icon: <IoLogoWhatsapp />, link: "/Admin/wbotCustomers" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const checkTokenExpiration = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const decodedToken: JwtPayload = jwtDecode(accessToken);
        const expirationTime = decodedToken.exp ? decodedToken.exp * 1000 : 0; // Convert to milliseconds

        if (expirationTime && Date.now() >= expirationTime) {
          console.log("Token expired, logging out...");
          handleSignOut();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        handleSignOut();
      }
    } else {
      handleSignOut();
    }
  };

  useEffect(() => {
    checkTokenExpiration(); // Check immediately when the component mounts
    const interval = setInterval(checkTokenExpiration, 60000); // Check every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="w-full flex items-center justify-center h-full bg-white">
        <div className="w-full max-w-[1920px] h-full flex flex-col bg-white">
          <div className="w-full flex flex-col sticky top-0 z-[100] bg-white">
            <Header
              title="Administrator"
              leftChildren={
                <>
                  <CurrentDate />
                  <CurrentTime />
                  <div
                    onClick={() => setShowNotification(!showNotification)}
                    className="flex items-center justify-center relative cursor-pointer"
                  >
                    <img
                      src={bellIcon}
                      alt="bell-icon"
                      className="w-[20px] h-auto invert"
                    />
                    <div className="w-2 h-2 rounded-full bg-red-600 absolute top-0 right-0" />
                  </div>
                  <UserProfile />
                </>
              }
              onMenuOpen={(value) => setOpenSideBar(value)}
              notificationSmallDevice={
                <div
                  onClick={() => setShowNotification(!showNotification)}
                  className="flex items-center justify-center relative cursor-pointer"
                >
                  <img
                    src={bellIcon}
                    alt="bell-icon"
                    className="w-[16px] h-auto invert"
                  />
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 absolute top-1 right-0" />
                </div>
              }
            />
          </div>
          <div className="w-full grid md:grid-cols-[80px_1fr]">
            <aside className="self-start sticky top-[64px] w-fit bg-white z-[150] hidden sm:flex font-semibold">
              <Sidebar items={navList} onSignOutClick={handleSignOut} />
            </aside>
            <div className="w-full h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <NotificationBar
        open={showNotification}
        onClose={() => setShowNotification(false)}
      />
      <MobileSideBar
        date={<CurrentDate />}
        time={<CurrentTime />}
        navList={navList}
        title="Administrator"
        open={openSideBar}
        sidebarButtons={
          <div
            onClick={handleSignOut}
            className="w-full flex flex-row justify-start items-center gap-4 h-[50px] text-gray-700 rounded-md p-4"
          >
            <div className="flex items-center justify-center size-[24px]">
              <img src={signOutIcon} alt="signout" className="w-4 h-4" />
            </div>
            <p className="text-[16px] font-medium">Sign Out</p>
          </div>
        }
      />
    </>
  );
};

export default AdminDashboardLayout;

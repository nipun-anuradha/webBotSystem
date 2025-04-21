import { signOutIcon } from "../data";

interface SidebarProps {
  items: {
    icon: JSX.Element;
    name: string;
    link: string;
  }[];
  onSignOutClick?: () => void;
  showSignout?: boolean;
}

const Sidebar = ({
  items,
  onSignOutClick,
  showSignout = false,
}: SidebarProps) => {
  const path = window.location.pathname;

  return (
    <div className="bg-gray-100 w-[90px] h-[calc(100vh-64px)] shadow-lg drop-shadow-md flex flex-col items-start group gap-2 p-4 hover:w-[200px] transition-all duration-300 ease-in-out">
      <div className="w-full h-full flex flex-col flex-grow gap-2">
        {items.map((item, index) => {
          let isActive = path === item.link;
          return (
            <a
              href={item.link}
              key={index}
              className={`flex items-center space-x-4 px-4 py-2 cursor-pointer rounded transition-all duration-200 ${
                isActive ? " bg-purple-600 text-white" : "text-gray-700"
              } hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-600 hover:text-white`}
            >
              <span className="w-6 h-6 flex items-center justify-center fixed">
                {item.icon}
              </span>
              <span className="whitespace-nowrap transition-opacity duration-300 opacity-0 group-hover:opacity-100 ml-[2rem]">
                {item.name}
              </span>
            </a>
          );
        })}
      </div>

      {showSignout && (
        <div
          onClick={onSignOutClick}
          className="flex items-center space-x-4 px-4 py-2 cursor-pointer rounded transition-all duration-200 bg-red-600"
        >
          <img src={signOutIcon} alt="signout" className="w-6 h-6 invert" />
          <span className="whitespace-nowrap text-white text-[14px] font-semibold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            Sign Out
          </span>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

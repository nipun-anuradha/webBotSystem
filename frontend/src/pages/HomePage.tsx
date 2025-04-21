import { useNavigate } from "react-router-dom";
import zlogo from "../assets/logo/z logo.png"; // Logo added back
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const whatsappLink = "https://wa.me/your-number-or-group-link"; // Replace with actual WhatsApp link

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Logo */}
      <div className="absolute top-5 left-5 z-20 bg-white/10 p-2 rounded-lg drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
        <img
          src={zlogo}
          alt="Logo"
          className="w-24 h-24 md:w-24 md:h-24 object-contain"
        />
      </div>

      {/* Background Image */}
      <img
        src="https://i.ibb.co/HDzFgHrb/c.jpg"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Increased Black Overlay (No Blur) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-10"></div>

      {/* Overlay Content - No Blur Effects */}
      <div className="relative z-20 text-center text-white px-4">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8">
          Zentex Electricals
        </h1>
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold mb-6 sm:mb-8">
          welcome to zentex electricals
        </h1>

        {/* Login Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Button to Open Modal */}
          <button
            onClick={() => setOpen(true)}
            className="bg-[#863cbb] hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg sm:text-xl transition-all shadow-lg flex items-center gap-2"
          >
            <FaWhatsapp />
            Customer service
          </button>

          {/* Modal */}

          {open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 backdrop-blur-sm">
              {/* Modal Content */}
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center relative">
                <h2 className="text-xl font-bold mb-2">open</h2>
                <p className="text-gray-700 mb-4">
                  Go to whatsapp chat service
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 justify-center transition-all"
                >
                  <FaWhatsapp /> Join WhatsApp
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate("/login")}
            className="bg-[#863cbb] hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg sm:text-xl transition-all shadow-lg"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import cover from "../assets/zentex word.jpg";
import { useState } from "react";
import axios, { AxiosError } from "axios";

// Define the response interface
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get API URL from environment variable, with fallback
  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3010";

  const handleLogin = async () => {
    // Clear previous errors
    setError("");

    // Validation for username and password fields
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post<LoginResponse>(`${API_URL}/admin/login`, {
        username,
        password
      });

      // If login is successful, save the token and role
      const { accessToken, refreshToken, role } = response.data;
      
      if (accessToken) {
        // Store tokens and role in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userRole", role);
        
        // Navigate based on role
        if (role === "admin") {
          navigate("/Admin/adminhome");
        } else {
          // Default route for other roles
          navigate("/dashboard");
        }
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error: unknown) {
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        // This is an axios error
        const axiosError = error as AxiosError<{ message: string }>;
        
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(axiosError.response.data?.message || "Login failed. Please try again.");
        } else if (axiosError.request) {
          // The request was made but no response was received
          setError("No response from server. Please try again later.");
        } else {
          // Something happened in setting up the request
          setError(axiosError.message || "Login failed. Please try again.");
        }
      } else {
        // This is not an axios error
        setError((error as Error).message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#c2acc923] flex items-center justify-center p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
      >
        {/* Left Image */}
        <div className="w-full md:w-1/2 relative">
          <img
            src={cover}
            alt="Modern Design"
            className="w-full h-full object-cover rounded-l-3xl"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-center space-y-6 bg-gray-100 rounded-r-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight text-center md:text-left"
          >
            Login
          </motion.h1>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Username Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col space-y-2"
          >
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-800"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-purple-200 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c2acc923] text-black shadow-md transition-all"
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col space-y-2"
          >
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-purple-200 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c2acc923] text-black shadow-md transition-all"
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            onClick={handleLogin}
            disabled={isLoading}
            className="text-white w-full bg-purple-600 border-gray-200 font-semibold py-3 rounded-lg transition-all shadow-lg hover:bg-purple-500 hover:text-white disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const useCountUp = (start: number, end: number, duration: number) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [start, end, duration]);

  return count;
};

const AdminHome = () => {
  const totalStudents = useCountUp(0, 120, 2000);
  const answeredStudents = useCountUp(0, 80, 2000);
  const completionRate = useCountUp(0, 90, 2000);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative p-4 sm:p-8"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/HDzFgHrb/c.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 "
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl sm:text-2xl md:text-2xl font-semibold text-gray-100 text-left mb-6 sm:mb-10"
        >
          Welcome, Admin!
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white p-6 sm:p-8 rounded-lg shadow-xl text-center hover:scale-105 transition-all ease-in-out"
          >
            <motion.h2 className="text-3xl sm:text-4xl font-medium text-gray-900">
              {totalStudents}
            </motion.h2>
            <motion.p className="text-lg text-gray-500 mt-2">
              Total Whatsapp clients
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="bg-white p-6 sm:p-8 rounded-lg shadow-xl text-center hover:scale-105 transition-all ease-in-out"
          >
            <motion.h2 className="text-3xl sm:text-4xl font-medium text-gray-900">
              {answeredStudents}
            </motion.h2>
            <motion.p className="text-lg text-gray-500 mt-2">
              Registered Customers
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="bg-white p-6 sm:p-8 rounded-lg shadow-xl text-center hover:scale-105 transition-all ease-in-out"
          >
            <motion.h2 className="text-3xl sm:text-4xl font-medium text-gray-900">
              {completionRate}
            </motion.h2>
            <motion.p className="text-lg text-gray-500 mt-2">
              Today Chats
            </motion.p>
          </motion.div>

          
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="text-lg sm:text-xl text-gray-100 text-left">
            Here you can manage your customers data and track progress with ease.
            Keep up the great work!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminHome;

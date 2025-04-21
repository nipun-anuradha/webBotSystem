import { useEffect, useState } from 'react'

const CurrentDate = () => {
  const [currentDate, setCurrentDate] = useState<string>("");

  // Update the date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString("en-GB")); // Format: DD/MM/YYYY
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);
  return (
    <div className="text-[12px] text-black ">{currentDate}</div>
  )
}

export default CurrentDate
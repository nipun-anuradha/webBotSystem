import { useEffect, useState } from 'react'

const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update the date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);
  return (
    <div className="text-[12px] text-black">{currentTime}</div>
  )
}

export default CurrentTime
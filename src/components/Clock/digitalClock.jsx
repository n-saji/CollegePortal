import { useEffect, useState } from "react";
import "./digitalClock.css";

function DigitalClock(mode) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function formatTime() {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${ampm}`;
  }

  function padZero(num) {
    return num < 10 ? "0" + num : num;
  }

  return (
    <div className="clock">
      <p
        style={{
          color: mode.darkMode ? "white" : "black",
          transition: "all 1s ease",
        }}
      >
        {formatTime()}
      </p>
    </div>
  );
}

export default DigitalClock;

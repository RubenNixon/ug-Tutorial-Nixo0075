import { useState, useEffect } from 'react';

function LiveClock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="live-clock">
      Match Timer: {seconds} seconds
    </div>
  );
}

export default LiveClock;
import React, { useEffect, useState } from "react";
import { formatDateISO, formatTime } from "../utils/helper";

const Home = () => {
  const [timeNow, setTimeNow] = useState(new Date());
  const user = JSON.parse(localStorage.getItem("user"))


  useEffect(() => {
    const timer = setInterval(() => setTimeNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lg:w-[90%] w-[98%] mx-auto pt-24 ">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-gradient-to-r from-green-900 via-green-600 to-green-900 text-white lg:rounded-r-lg p-6 text-center border-yellow-600 lg:border-2">
          <h1 className="sm:text-2xl text-sm font-bold">  {user.name}, {user.title}</h1>

          <p>{formatDateISO(timeNow)}</p>

          <p className="mt-4 text-4xl font-bold bg-white text-green-900 inline-block px-4 w-50 py-1 rounded">
            {formatTime(timeNow)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import pageNotFound from "../imgs/404.png";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  const gotoHomeHandler = () => {
    navigate("/");
  };
  return (
    <section className="flex flex-col items-center mt-20 md:mt-10">
      <img src={pageNotFound} className="w-[45%] md:w-[20%] object-cover"></img>
      <h1 className="mt-2">Page you are looking for does not exist</h1>
      <button onClick={gotoHomeHandler} className="btn-dark px-10 py-2 mt-5">
        Home
      </button>
    </section>
  );
};

export default NotFound;

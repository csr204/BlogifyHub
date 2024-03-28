import React, { useContext, useRef, useState } from "react";
import userContext from "../common/Context";

const PageNav = ({ setPage: page, totalPages }) => {
  const [activeBtn, setActiveBtn] = useState(1);
  const { darkMode } = useContext(userContext);
  let btns = [];
  // console.log(totalPages);
  for (let i = 1; i <= totalPages; i++) {
    btns.push(i);
  }
  // console.log(btns.length);
  //TODO:advanced pagination
  const leftHandler = () => {
    if (activeBtn === 1) return;
    page(Number(activeBtn) - 1);
    setActiveBtn(Number(activeBtn) - 1);
  };
  const rightHandler = () => {
    if (activeBtn === totalPages) return;
    page(Number(activeBtn) + 1);
    setActiveBtn(Number(activeBtn) + 1);
  };
  return (
    <div className="flex gap-3 mt-4">
      <button
        className={
          "w-8 h-8 rounded-md bg-grey text-center cursor-pointer" +
          `${
            activeBtn === 1
              ? `${
                  darkMode ? "bg-white text-black" : "text-white bg-black"
                }  cursor-not-allowed `
              : ""
          }`
        }
        onClick={leftHandler}
      >
        <i className="ri-arrow-left-s-fill"></i>
      </button>
      {btns.map((btn, i) => {
        return (
          <button
            className={
              "w-8 h-8 rounded-md  text-center cursor-pointer " +
              `${
                i + 1 === activeBtn
                  ? ` bg-twitter ${
                      darkMode ? "text-black bg-white" : "text-white bg-grey"
                    }`
                  : ""
              }`
            }
            onClick={() => {
              setActiveBtn(i + 1);
              page(i + 1);
            }}
            key={i}
          >
            {btn}
          </button>
        );
      })}
      <button
        className={
          "w-8 h-8 rounded-md bg-grey text-center cursor-pointer" +
          `${
            activeBtn === totalPages
              ? `${
                  darkMode ? "bg-white text-black" : "text-white bg-black"
                }  cursor-not-allowed `
              : ""
          }`
        }
        onClick={rightHandler}
      >
        <i className="ri-arrow-right-s-fill"></i>
      </button>
    </div>
  );
};

export default PageNav;

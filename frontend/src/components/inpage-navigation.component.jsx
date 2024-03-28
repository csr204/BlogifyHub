import React, { useEffect, useRef, useState } from "react";
export let defaultBtnRef;
const InpageNav = ({ routes, defaultHidden = [], children }) => {
  const [activeBtn, setActiveBtn] = useState(0);
  const lineRef = useRef();
  defaultBtnRef = useRef();
  const lineDecoration = (e, index) => {
    const { offsetLeft, offsetWidth } = e;
    // console.log(offsetLeft, offsetWidth);
    lineRef.current.style.left = offsetLeft + "px";
    lineRef.current.style.width = offsetWidth + "px";
    setActiveBtn(index);
  };
  useEffect(() => {
    lineDecoration(defaultBtnRef.current, 0);
  }, []);
  const resizeHandler = () => {
    //check window obj's innerwidth
    if (window.innerWidth >= 768) {
      setActiveBtn(0);
      lineDecoration(defaultBtnRef.current, 0);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);
  return (
    <>
      <div className="relative border-b-2 border-b-grey flex flex-nowrap">
        {routes.map((route, index) => {
          return (
            <button
              onClick={(e) => {
                lineDecoration(e.target, index);
              }}
              ref={index == 0 ? defaultBtnRef : null}
              key={index}
              className={
                "m-1 px-2 py-2 capitalize " +
                (index === activeBtn ? "text-black " : "text-dark-grey ") +
                (defaultHidden.includes(route) ? "md:hidden " : "")
              }
            >
              {route}
            </button>
          );
        })}
        <hr className="absolute bottom-0" ref={lineRef} />
      </div>
      {Array.isArray(children) ? children[activeBtn] : children}
    </>
  );
};

export default InpageNav;

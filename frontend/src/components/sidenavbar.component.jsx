import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import userContext from "../common/Context";

const SideBar = () => {
  const userCtx = useContext(userContext);
  const { showSearch } = userCtx;
  const {
    message: { token },
    newNotificationAvailable,
  } = userCtx.isLoggedIn;
  let currentPath = "";
  const page = location.pathname.split("/")[2];
  if (page) currentPath = page.replace("-", " ");
  const [pageState, setPageState] = useState(currentPath);
  const [showSideNav, setShowSideNav] = useState(false);
  const sideBarRef = useRef();
  const activeTab = useRef();
  const pageStateTab = useRef();
  const changeState = (e) => {
    let { offsetWidth, offsetLeft } = e.target;
    // console.log(offsetWidth);
    if (activeTab.current) {
      activeTab.current.style.left = offsetLeft + "px";
      activeTab.current.style.width = offsetWidth + "px";
    }
    if (sideBarRef.current) {
      if (e.target === sideBarRef.current) setShowSideNav(true);
      else setShowSideNav(false);
    }
  };
  useEffect(() => {
    setShowSideNav(false);
    if (pageStateTab.current) {
      pageStateTab.current.click();
    }
  }, [pageState]);
  // console.log(newNotificationAvailable);
  return (
    <>
      {token === null ? (
        <Navigate to={"/signin"} />
      ) : (
        <section
          className={`flex relative gap-10 py-0 m-0 max-md:flex-col ${
            showSearch ? "" : "max-md:top-[-38px]"
          }`}
        >
          <div className="sticky top-[80px] z-30 ">
            <div className="md:hidden py-1 bg-white border-b border-grey flex flex-nowrap overflow-x-auto relative ">
              <button
                className="p-5"
                ref={sideBarRef}
                onClick={(e) => changeState(e)}
              >
                <i className="ri-menu-2-fill pointer-events-none"></i>
              </button>
              <button
                className="p-5 capitalize"
                ref={pageStateTab}
                onClick={(e) => changeState(e)}
              >
                {pageState}
              </button>
              <hr className="absolute duration-300 bottom-0" ref={activeTab} />
            </div>
            <div
              className={
                "min-w-[200px] h-calc[(200vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r-2 absolute max-md:top-[64px] bg-white  max-md:m-0 max-md:px-16 max-md:-ml-7 duration-500 max-md:w-[calc(100%+45px)] " +
                (showSideNav
                  ? "max-md:opacity-100 max-md:pointer-events-auto"
                  : "max-md:opacity-0 max-md:pointer-events-none")
              }
            >
              <h1 className="text-xl mb-3 ">Dashboard</h1>
              <hr className="border-grey -ml-6 mb-8 mr-6"></hr>
              <NavLink
                to="/dashboard/blogs"
                className="sidebar-link"
                onClick={(e) => setPageState(e.target.innerText)}
              >
                <i className="ri-article-fill"></i>
                blogs
              </NavLink>
              <NavLink
                to="/dashboard/notifications"
                className="sidebar-link"
                onClick={(e) => setPageState(e.target.innerText)}
              >
                <div className="relative">
                  <i className="ri-notification-4-fill"></i>
                  {newNotificationAvailable ? (
                    <span className="bg-red w-[5px] h-[5px] rounded-full absolute top-0 left-3"></span>
                  ) : (
                    ""
                  )}
                </div>
                notifications
              </NavLink>
              <NavLink
                to="/editor"
                className="sidebar-link"
                onClick={(e) => setPageState(e.target.innerText)}
              >
                <i className="ri-pen-nib-fill"></i>
                write
              </NavLink>
              <h1 className="text-xl mb-3 mt-20 max-md:mt-8">Settings</h1>
              <hr className="border-grey -ml-6 mb-8 mr-6"></hr>
              <NavLink
                to="/settings/edit-profile"
                className="sidebar-link"
                onClick={(e) => setPageState(e.target.innerText)}
              >
                <i className="ri-user-fill"></i>
                edit profile
              </NavLink>
              <NavLink
                to="/settings/change-password"
                className="sidebar-link"
                onClick={(e) => setPageState(e.target.innerText)}
              >
                <i className="ri-lock-2-fill"></i>
                change password
              </NavLink>
            </div>
          </div>
          <div className="max-md:-mt-8 mt-5 w-full">
            <Outlet />
          </div>
        </section>
      )}
    </>
  );
};

export default SideBar;

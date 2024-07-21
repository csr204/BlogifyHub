import React, { useContext, useEffect, useRef, useState } from "react";
import logo from "../imgs/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import userContext from "../common/Context";
import UserNavigation from "./user-navigation.component";

export let searchRef;
const Navbar = () => {
  const userCtx = useContext(userContext);
  const {
    showSearch,
    setSearchStatus,
    isLoggedIn,
    setIsLoggedIn,
    darkMode,
    setDarkMode,
  } = userCtx;
  const [showUserNav, setUserNav] = useState(false);
  const [search, setSearch] = useState("");
  // console.log(isLoggedIn);
  const {
    message: { token, user },
    newNotificationAvailable,
  } = isLoggedIn;
  // console.log(isLoggedIn);
  // console.log(user);
  const { profile_img } = user;
  const navigate = useNavigate();
  searchRef = useRef();
  // const profile_img=getSessionStorage()
  const searchToggler = () => {
    setSearchStatus((prev) => {
      return !prev;
    });
  };
  const resizeHandler = () => {
    if (window.innerWidth <= 768) {
      setSearchStatus(false);
    } else {
      setSearchStatus(true);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);
  const userNavHandler = () => {
    setUserNav((prev) => !prev);
  };
  const blurUserPanelHandler = () => {
    setTimeout(() => {
      setUserNav(false);
    }, 500);
  };
  const searchHandler = (e) => {
    //enter=13

    if (e.keyCode === 13) {
      setSearch(e.target.value);
      navigate(`search/${e.target.value}`);
    }
    // console.log(e.target.value);
    //create a dynamic search page with this req param as this search val and navigate to that page
  };
  //absolute left-0 m-3 top-[100%]
  useEffect(() => {
    if (token) {
      const fetchNotificationsStatus = async () => {
        try {
          const response = await fetch(
            import.meta.env.VITE_SERVER + "/blogs/get-notifications",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const { message } = await response.json();
          if (!response.ok) {
            throw new Error(message);
          }
          // console.log(message);
          setIsLoggedIn((prev) => {
            return { ...prev, newNotificationAvailable: message };
          });
        } catch (e) {
          console.log(e.message);
        }
      };
      fetchNotificationsStatus();
    }
  }, [token]);
  return (
    <>
      <div
        className={`navbar font-Gelasio mb-10 md:mb-0 z-50 max:md-relative ${
          darkMode ? "bg-[#2c2f36]" : ""
        }`}
      >
        <Link to="/">
          <img src={logo} className="w-12"></img>
        </Link>
        <div
          className={`w-full absolute left-0 top-[100%] mt-0 md:m-3 p-4 pl-2 md:relative md:top-0 ${
            showSearch ? "" : "max-md:hidden"
          }`}
        >
          {showSearch && (
            <>
              {/* <i className="ri-search-line absolute z-20 top-[31%] right-8 md:top-[33%] md:left-[2%]"></i> */}
              <i
                className={`ri-search-line absolute  top-[31%] right-8 md:top-[33%] md:w-4 md:right-2 md:left-[20px]`}
              ></i>
              <input
                type="text"
                placeholder="search.."
                className="w-full md:w-auto bg-grey rounded-full  h-10 pl-10 pr-[12%]"
                onKeyDown={searchHandler}
                ref={searchRef}
              />
            </>
          )}
        </div>
        <div className="flex mr-2 ml-auto gap-3">
          <button
            onClick={searchToggler}
            className=" md:hidden w-10 h-10 rounded-full bg-grey cursor-pointer flex justify-center items-center hover:bg-dark-grey"
          >
            <i className="ri-search-line text-2xl"></i>
          </button>
          {token ? (
            <div className="flex gap-2">
              {/* <div
                onClick={() => {
                  setDarkMode((prev) => !prev);
                }}
                className="w-10 h-10 rounded-full bg-grey hover:bg-white cursor-pointer flex justify-center items-center relative"
              >
                {!darkMode ? (
                  <i className="ri-moon-fill text-2xl"></i>
                ) : (
                  <i className="ri-sun-fill text-2xl"></i>
                )}
              </div> */}
              {/* notification*/}

              <Link
                className="w-10 h-10 rounded-full bg-grey hover:bg-white cursor-pointer flex justify-center items-center relative"
                to="/dashboard/notifications"
              >
                <i className="ri-notification-4-line text-2xl"></i>
                {newNotificationAvailable ? (
                  <span className="bg-red w-2 h-2 rounded-full absolute top-1 right-2"></span>
                ) : (
                  ""
                )}
              </Link>
              {/* profile*/}
              <div
                className="relative"
                onClick={userNavHandler}
                onBlur={blurUserPanelHandler}
              >
                <Link className="w-10 h-10 rounded-full bg-grey hover:bg-white cursor-pointer flex justify-center items-center">
                  <img
                    src={profile_img}
                    className="w-10 h-10 object-cover rounded-full"
                  ></img>
                </Link>
                {showUserNav ? <UserNavigation /> : ""}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <Link to="/editor" className="mr-3 bg-grey p-2 px-3">
                <i className="ri-pencil-fill  text-black"></i>
                write
              </Link>
              <Link to="/signin">
                <button className="btn-dark py-2">Sign in</button>
              </Link>
              <Link to="/signup">
                <button className="btn-light hidden md:block py-2">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;

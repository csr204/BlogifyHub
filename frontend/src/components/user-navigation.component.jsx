import React, { useContext } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import { Link, useNavigate } from "react-router-dom";
import userContext from "../common/Context";
import { removeSessionStorage } from "../common/session";
const UserNavigation = () => {
  const userCtx = useContext(userContext);
  const navigate = useNavigate();
  const logoutHandler = () => {
    removeSessionStorage("user");
    userCtx.setIsLoggedIn({
      message: {
        token: null,
        user: { username: "", fullname: "", profile_img: "" },
      },
    });
    navigate("/");
  };
  let {
    message: { user },
  } = userCtx.isLoggedIn;
  // console.log(user);
  let username = user.username;
  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-[-50%] md:right-[-150%] z-50"
    >
      <div className="bg-white absolute right-0 w-60 overflow-hidden duration-200 border-2 border-grey">
        <Link className="link flex gap-2 pl-8 py-4" to="/editor">
          <i className="ri-pencil-fill  text-black"></i>
          write
        </Link>
        <Link className="link flex gap-2 pl-8 py-4" to={`/user/${username}`}>
          <i className="ri-profile-fill  text-black"></i>
          profile
        </Link>
        <Link className="link flex gap-2 pl-8 py-4" to={`/dashboard/blogs`}>
          <i className="ri-dashboard-fill text-black"></i>
          DashBoard
        </Link>
        {/* <Link className="link flex gap-2 pl-8 py-4" to={`/user/${username}`}>
          <i className="ri-settings-3-fill  text-black"></i>
          settings
        </Link> */}
        <button
          className="link flex gap-2 pl-8 py-4 w-full"
          onClick={logoutHandler}
        >
          <i className="ri-logout-box-r-line text-black"></i>
          <div className="flex-col gap-2 text-left text-black">
            <h1 className="font-bold capitalize">logout</h1>
            <p>@{user.username}</p>
          </div>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigation;

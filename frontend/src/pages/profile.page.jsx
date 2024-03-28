import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import youtube from "../imgs/youtube.svg";
import github from "../imgs/github.svg";
import facebook from "../imgs/facebook.svg";
import twitter from "../imgs/twitter.svg";
import instagram from "../imgs/insta.svg";
import website from "../imgs/website.svg";
import userContext from "../common/Context";
import UserBlog from "../components/userBlog";
import PageNav from "../components/PageNav";
import Nodata from "../components/nodata.component";
// import Loader from "../components/loader.component";
const imagesrc = [youtube, instagram, facebook, twitter, github, website];
const Profile = () => {
  const userctx = useContext(userContext);
  const {
    message: { token },
  } = userctx.isLoggedIn;
  let LoggedInusername = "";
  if (token) {
    const {
      message: {
        user: { username: LoggedInUser },
      },
    } = userctx.isLoggedIn;
    LoggedInusername = LoggedInUser;
  }
  const requstedUser = useParams().id;

  // console.log(requstedUser);
  const [userDetails, setUserDetails] = useState(null);
  const [userBlogs, setUserBlogs] = useState({ blogs: [{}], totalPages: 0 });
  const { blogs, totalPages } = userBlogs;
  // console.log(blogs);
  const [page, setPage] = useState(1);
  // console.log("page:", page);
  const getUser = async () => {
    const requestForUser = await fetch(
      `http://localhost:3000/users/getUser/${requstedUser}`
    );
    const detailsOfUser = await requestForUser.json();
    if (detailsOfUser.message === null) {
      return toast.error(detailsOfUser.error);
    }
    setUserDetails(detailsOfUser.message);
    // console.log(detailsOfUser.message);
  };
  const fetchUserBlogs = async () => {
    if (requstedUser) {
      try {
        const response = await fetch(
          `http://localhost:3000/users/getBlogs/${requstedUser}/${page}`
        );
        const det = await response.json();
        //det is an obj and the elements are blogs and totalPages,totalPages is a number and blogs is an object
        // setUserBlogs(det.blogs);
        // console.log("backend data:", det);
        setUserBlogs((prev) => {
          let newBlogs = [...det.blogs.blogs];
          return { ...prev, blogs: newBlogs, totalPages: det.totalPages };
        });
        // console.log("totalPages:", det.totalPages);
        // console.log("array", det.blogs.blogs);
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    fetchUserBlogs();
  }, [page]);
  const navScrollerHandler = () => {
    window.scrollTo({
      top: 610,
      behavior: "smooth",
    });
  };
  return (
    <>
      {/* {userDetails === null || (userBlogs === null && <Loader />)} */}
      {userDetails !== null && (
        <div className="flex flex-col md:px-2 md:flex-row relative">
          <div className="w-full h-max overflow-auto md:w-[30%] h-cover flex flex-col items-center gap-6 py-5 justify-start">
            <img
              src={userDetails.personal_info.profile_img}
              className="w-[150px] h-[150px] rounded-full object-cover"
            ></img>
            <h1 className="text-[20px] font-medium">{requstedUser}</h1>
            <div>
              <span className="text-[12px] mr-4">
                Total posts:{userDetails.info.total_posts}
              </span>
              <span className="text-[12px]">
                Total reads:{userDetails.info.total_reads}
              </span>
            </div>
            <p className="pr-2 pl-3 line-clamp-6 max-h-[20%] text-center ">
              {userDetails.personal_info.bio}
            </p>
            {/* account links */}
            <div className="flex gap-2 flex-wrap">
              {userDetails !== null &&
                Object.values(userDetails.accounts).map((value, index) => {
                  return value.length ? (
                    <Link key={index} to={value} target="_blank">
                      {value.length > 0 && <img src={imagesrc[index]}></img>}
                    </Link>
                  ) : (
                    ""
                  );
                })}
            </div>
            {/* edit option */}
            {LoggedInusername === requstedUser && (
              <Link
                className="btn-dark px-6 py-2 text-[13px]"
                to={"/settings/edit-profile"}
              >
                edit profile
              </Link>
            )}
            <div
              className="w-10 h-10 rounded-full bg-black absolute right-5 bottom-[55%] cursor-pointer block py-[4px]  md:hidden"
              onClick={navScrollerHandler}
            >
              <i className="ri-arrow-down-fill text-white text-[20px] px-[7px]"></i>
            </div>
          </div>
          {/* get blogs written by user and display em here  */}
          {
            <div className="w-full md:w-[70%] h-cover max-md:relative">
              {blogs.length > 1 ? (
                <UserBlog details={blogs} />
              ) : (
                <Nodata message={"User does not have any blogs"} />
              )}
              {blogs && blogs.length > 1 && (
                <div className="fixed md:left-[420px] md:bottom-12 ml-10 mt-10 max-md:bottom-10 max-md:absolute">
                  <PageNav setPage={setPage} totalPages={totalPages} />
                </div>
              )}
            </div>
          }
        </div>
      )}
    </>
  );
};

export default Profile;

import React, { useContext, useEffect, useRef, useState } from "react";
import userContext from "../common/Context";
import toast, { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/AnimationWrapper";
import Loader from "../components/loader.component";
import Input from "../components/input.component";
import youtube from "../imgs/youtube.svg";
import github from "../imgs/github.svg";
import facebook from "../imgs/facebook.svg";
import twitter from "../imgs/twitter.svg";
import instagram from "../imgs/insta.svg";
import website from "../imgs/website.svg";
import uploadImage from "../common/aws";
import {
  addsessionStorage,
  clearSessionStorage,
  removeSessionStorage,
} from "../common/session";
const imagesrc = [youtube, instagram, facebook, twitter, github, website];
const detailsStructure = {
  account_info: { total_posts: 0, total_reads: 0 },
  blogs: [],
  google_auth: "",
  joinedAt: "",
  personal_info: {
    username: "",
    bio: "",
    fullname: "",
    email: "",
    profile_img: "",
  },
  _id: "",
  social_links: {
    youtube: "",
    twitter: "",
    instagram: "",
    facebook: "",
    website: "",
    github: "",
  },
};
const EditProfile = () => {
  const bioLimit = 150;
  const userCtx = useContext(userContext);
  const formRef = useRef();
  const { setIsLoggedIn } = userCtx;
  const {
    message: { token, user },
  } = userCtx.isLoggedIn;
  const [userState, setUserState] = useState(detailsStructure);
  const [loading, setLoading] = useState(true);
  const [updatedProfilePic, setUpdatedProfilePic] = useState(null);
  const [bioCharacters, setBioCharacters] = useState(bioLimit);
  const {
    personal_info: { username, profile_img, email, bio, fullname },
    personal_info,
    social_links,
  } = userState;
  useEffect(() => {
    const fetchDetails = async () => {
      if (token) {
        const {
          message: {
            user: { username },
          },
        } = userCtx.isLoggedIn;
        try {
          const response = await fetch(
            import.meta.env.VITE_SERVER + "/users/edit-profile",
            {
              method: "POST",
              body: JSON.stringify({ username }),
              headers: { "Content-Type": "application/json" },
            }
          );
          const { message: data } = await response.json();
          // console.log(data);
          setUserState(data);
          setLoading(false);
        } catch {
          toast.error("something went wrong");
        }
      }
    };
    fetchDetails();
  }, [token]);
  const profilePicRef = useRef();
  const bioChangeHandler = (e) => {
    // console.log(e);
    // if(e.keyValue)
    setBioCharacters(bioLimit - e.target.value.length);
    setUserState((prev) => {
      return {
        ...prev,
        personal_info: { ...personal_info, bio: e.target.value },
      };
    });
    // console.log(e.target.value);
  };
  const profileImgHandler = (e) => {
    const prof_img = e.target.files[0];
    profilePicRef.current.src = URL.createObjectURL(prof_img);
    // console.log(profilePicRef.current.src);
    // console.log(image); //output-blob:http://localhost:5173/someRandomNumber
    setUpdatedProfilePic(prof_img);
  };
  const profileUploadHandler = async (e) => {
    e.preventDefault();
    e.target.setAttribute("disabled", true);
    if (updatedProfilePic) {
      const loadingToast = toast.loading("uploading..");

      try {
        console.log(updatedProfilePic);
        const img = await uploadImage(updatedProfilePic);
        //req to backend
        console.log(img);
        const response = await fetch(
          import.meta.env.VITE_SERVER + "/users/profile-pic",
          {
            method: "POST",
            body: JSON.stringify({ img }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { message: data } = await response.json();
        // if (!response.ok) throw new Error(data);
        // console.log(data);
        let sessionObj = userCtx.isLoggedIn.message;
        sessionObj = { ...sessionObj, user: { ...user, profile_img: data } };
        console.log(sessionObj);
        clearSessionStorage();
        addsessionStorage("user", JSON.stringify(sessionObj));
        setIsLoggedIn(sessionObj);
        setUpdatedProfilePic(null);
        toast.dismiss(loadingToast);
        toast.success("uploaded");
      } catch (e) {
        setUpdatedProfilePic(null);
        toast.dismiss(loadingToast);
        // return toast.error(e);
        // console.log(e);
        e.target.removeAttribute("disabled");
      }
    } else {
      e.target.removeAttribute("disabled");

      return toast.error("select a pic to upload");
    }
  };
  const submitHandler = async (e) => {
    //make req to backend findOneAndUpdate,make use of toasts to notify the user whatabouts
    e.preventDefault();
    const {
      personal_info: { bio, username },
      social_links,
    } = userState;
    if (username.length < 3)
      return toast.error("username must have atleast 3 letters");
    if (bio.length > bioLimit) {
      return toast.error("bio should not have more than 150 charcters");
    }
    console.log(social_links);
    const loadingToast = toast.loading("updating...");
    e.target.setAttribute("disabled", true);
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + "/users/edit-details",
        {
          method: "POST",
          body: JSON.stringify({ username, bio, social_links }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message: data } = await response.json();
      if (!response.ok) throw new Error(data);
      console.log(data, userCtx.isLoggedIn.message.user.username);
      if (userCtx.isLoggedIn.message.user.username != data) {
        //update sessionObj
        let userObj = userCtx.isLoggedIn;
        userObj = { ...userObj, user: { ...user, username: data } };
        removeSessionStorage("user");
        addsessionStorage("user", JSON.stringify(userObj));
        setIsLoggedIn(userObj);
      }
      toast.dismiss(loadingToast);
      toast.success("updated");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message);
    } finally {
      e.target.removeAttribute("disabled");
    }
  };
  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form ref={formRef}>
          <Toaster />
          <h1 className="max-md:hidden pt-3 pl-12 mb-2 text-[18px] text-bold ">
            Edit profile
          </h1>
          <div className="flex flex-col lg:flex-row items-start py-8 gap-8 lg-gap-10 px-3 max-md:px-6">
            <div className="max-lg:center mb-5">
              <label
                htmlFor="profileImage"
                id="profile_label"
                className="relative block w-48 h-48 overflow-hidden bg-grey rounded-full"
              >
                <div className="bg-black/50 absolute top-0 left-0 w-full h-full rounded-full text-white flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer">
                  upload Image
                </div>
                <img src={profile_img}></img>
              </label>
              <input
                type="file"
                hidden
                accept=".jpeg,.jpg,.png"
                id="profileImage"
                onChange={profileImgHandler}
                ref={profilePicRef}
              />
              <button
                className="btn-light mt-5 max-lg:center lg:w-full px-10"
                onClick={profileUploadHandler}
              >
                Upload
              </button>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div className="relative">
                  <i className="ri-user-fill absolute top-4 left-4 "></i>
                  <Input
                    name="fullname"
                    type="text"
                    value={fullname}
                    placeholder="fullname"
                    disable={true}
                    className="input-box max-md:w-full"
                  />
                </div>
                <div className="relative">
                  <i className="ri-mail-fill absolute top-4 left-4"></i>
                  <Input
                    name="email"
                    type="email"
                    value={email}
                    placeholder="email"
                    disable={true}
                    className="input-box max-md:w-full"
                  />
                </div>
              </div>
              <div className="relative">
                <i className="ri-at-line absolute top-4 left-4 text-black "></i>
                <input
                  name="username"
                  type="text"
                  value={username}
                  placeholder="username"
                  className="input-box w-full"
                  onChange={(e) =>
                    setUserState((prev) => {
                      return {
                        ...prev,
                        personal_info: {
                          ...personal_info,
                          username: e.target.value,
                        },
                      };
                    })
                  }
                />
                <p className="mt-1 text-dark-grey">
                  Username will be visible to others
                </p>
              </div>
              <textarea
                name="bio"
                className="resize-none input-box h-64 lg:h-40 leading-7 mt-5 pl-5"
                defaultValue={bio}
                placeholder="bio"
                onChange={bioChangeHandler}
              ></textarea>
              <p className="-mt-1 text-dark-grey text-right">
                {bioCharacters} characters left
              </p>
              <p className="mt-6">Enter your social Links</p>
              <div className="grid md:grid-cols-2 gap-2 mt-3">
                {Object.keys(social_links).map((key, index) => {
                  return (
                    <div key={index} className="relative">
                      <img
                        src={imagesrc[index]}
                        className="w-6 h-6 absolute top-4 left-4"
                      ></img>
                      <input
                        className="input-box"
                        value={social_links[key]}
                        placeholder={key}
                        onChange={(e) =>
                          setUserState((prev) => {
                            const newSocialLinks = { ...social_links };
                            newSocialLinks[key] = e.target.value;
                            return { ...prev, social_links: newSocialLinks };
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <button
                className="btn-dark mt-5 px-8 text-[12px] py-2"
                type="submit"
                onClick={submitHandler}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfile;

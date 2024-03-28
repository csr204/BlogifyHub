import React, { useContext, useState } from "react";
import { blogContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import toast, { Toaster } from "react-hot-toast";
import userContext from "../common/Context";
import { useNavigate } from "react-router-dom";

const Publish = () => {
  const { setEditorState, blogState, setBlogState } = useContext(blogContext);
  const { isLoggedIn } = useContext(userContext);
  const [charTracker, setCharCount] = useState(0);
  const navigate = useNavigate();

  const closeHandler = () => {
    setEditorState("editor");
  };
  const blogTitleChangeHandler = (e) => {
    setBlogState((prev) => {
      return { ...prev, title: e.target.value };
    });
  };
  const maxCharacters = 200;

  const descriptionHandler = (e) => {
    const text = e.target.value;
    if (text.length < maxCharacters)
      setBlogState((prev) => {
        return { ...prev, des: text };
      });
    setCharCount(text.length);
  };
  const keyDownHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  const tagLimit = 10;
  const tagHandler = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let tag = e.target.value;
      let tags = blogState.tags;
      if (tags.length === tagLimit) {
        toast.error("Cannot have more than 10 tags");
      } else if (tags.length < tagLimit && tag.length) {
        if (!tags.includes(tag)) {
          setBlogState((prev) => {
            return { ...prev, tags: [...tags, tag] };
          });
        }
      }
      e.target.value = "";
    }
  };
  const publishHandler = async (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    let publishingToast = toast.loading("publishing");
    e.target.classList.add("disable");
    try {
      const response = await fetch("http://localhost:3000/blogs/createBlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLoggedIn.message.token}`,
        },
        body: JSON.stringify(blogState),
      });
      const message = await response.json();
      console.log(message);
      e.target.classList.remove("disable");
      toast.dismiss(publishingToast);
      toast.success("published");
      setTimeout(() => {
        navigate("/");
      }, 400);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="w-screen grid lg:grid-cols-2  lg:gap-2  mt-2 gap-4 lg:mt-8 max-h-[100vh]">
      <Toaster />
      <i
        className="ri-close-fill absolute z-20 right-[3vw] text-2xl top-2 cursor-pointer"
        onClick={closeHandler}
      ></i>
      <div className="w-full md:pt-8">
        <div className="max-w-[500px] center md:ml-10 ">
          <p className="mb-3 font-gelasio text-xl text-center">Preview</p>
          <img
            src={blogState.banner}
            className="w-full aspect-video rounded-lg overflow-hidden border-dark-grey object-cover"
          ></img>
          <h1 className="capitalize font-serif text-3xl leading-tight mt-3 line-clamp-2">
            {blogState.title}
          </h1>
          <p className="font-gelasio text-xl leading-7 mt-4 mb-14 md:mb-auto ">
            {blogState.des}
          </p>
        </div>
      </div>
      <div className="w-full md:pt-11">
        <p className="font-gelasio text-xl">Blog Title</p>
        <input
          className="input-box capitalize placeholder:text-dark-grey pl-4"
          placeholder={blogState.title}
          onChange={blogTitleChangeHandler}
        ></input>
        <p className="font-gelasio mt-8 text-xl">
          Short Description about your blog
        </p>
        <textarea
          maxLength={maxCharacters}
          className="h-40 leading-7 resize-none pl-4  pt-3 input-box"
          placeholder="description"
          defaultValue={blogState.des}
          onChange={descriptionHandler}
          onKeyDown={keyDownHandler}
        ></textarea>
        <p className="mt-2 text-right">
          {maxCharacters - charTracker} characters left
        </p>
        <p className="font-gelasio mt-7 text-xl">
          Topics (Helps in categorizing and ranking your post)
        </p>
        <div className="bg-grey input-box relative pl-2 py-2 pb-4">
          <input
            className="sticky input-box bg-white focus:bg-white pl-4 mb-2 "
            placeholder="Topics"
            onKeyDown={tagHandler}
          ></input>
          {blogState.tags.map((tag, i) => {
            return <Tag tag={tag} key={i} tagIndex={i} />;
          })}
        </div>
        <p className="mt-2 text-right">
          {tagLimit - blogState.tags.length} more tags can be added
        </p>
        <button
          className="btn-dark mt-2 px-6 py-2 lg:block lg:mx-auto"
          onClick={publishHandler}
        >
          publish
        </button>
      </div>
    </section>
  );
};

export default Publish;

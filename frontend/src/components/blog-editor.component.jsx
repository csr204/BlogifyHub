import React, { useContext, useEffect, useRef, useState } from "react";
import logo from "../imgs/logo.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import AnimationWrapper from "../common/AnimationWrapper";
import banner from "../imgs/blog_banner.png";
import uploadImage from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import { blogContext } from "../pages/editor.pages";
import { tools } from "./tools.component";
import userContext from "../common/Context";
const BlogEditor = () => {
  const { blogState, setBlogState, setTextEditor, textEditor, setEditorState } =
    useContext(blogContext);
  const { isLoggedIn } = useContext(userContext);
  const errorHandler = (e) => {
    e.target.src = banner;
  };
  const blog_id = useParams();
  useEffect(() => {
    setBlogState((prev) => {
      return { ...prev, id: blog_id };
    });
  }, []);
  const navigate = useNavigate();
  const imgUploadHandler = (e) => {
    const img = e.target.files[0];
    // console.log(img);
    if (img) {
      const uploadingToast = toast.loading("uploading");
      uploadImage(img)
        .then((imageURL) => {
          if (imageURL) {
            toast.dismiss(uploadingToast);
            setBlogState((prevState) => {
              return { ...prevState, banner: imageURL };
            });
            toast.success("uploaded");
          }
        })
        .catch((err) => {
          toast.dismiss(uploadingToast);
          return toast.error(err.message);
        });
    }
  };
  const keyDownHandler = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
    // setBlogState((prev) => {
    //   return { ...prev, title: e.target.value };
    // });
  };
  const heightHandler = (e) => {
    let textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    setBlogState((prev) => {
      return { ...prev, title: e.target.value };
    });
  };
  //textEditor
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: Array.isArray(blogState.content)
            ? blogState.content[0]
            : blogState.content,
          placeholder: "The blank canvas awaits your words...",
          tools: tools,
        })
      );
    }
  }, []);
  const publishHandler = () => {
    if (!blogState.banner.length || !blogState.title.length) {
      return toast.error("A blog must have a Banner and a Title");
    }

    if (textEditor.isReady) {
      //extract data on editor
      textEditor
        .save()
        .then((data) => {
          console.log(data);
          if (data.blocks.length) {
            setBlogState((prev) => {
              return { ...prev, content: data };
            });
            setEditorState("publish");
          } else {
            return toast.error("A blog must have atleast one character");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const saveDraftHandler = async (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    const dataOnEditor = await textEditor.save();
    // console.log(dataOnEditor);
    if (!dataOnEditor.blocks || dataOnEditor.blocks.length === 0) {
      return toast.error("blog must have atleast a character");
    }
    console.log(dataOnEditor);
    setBlogState((prev) => {
      return { ...prev, content: dataOnEditor };
    });
    const draftState = { ...blogState, draft: true };
    let publishingToast = toast.loading("publishing");
    e.target.classList.add("disable");
    try {
      const response = await fetch("http://localhost:3000/blogs/createBlog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isLoggedIn.message.token}`,
        },
        body: JSON.stringify(draftState),
      });
      const message = await response.json();
      console.log(message);
      toast.dismiss(publishingToast);
      e.target.classList.remove("disable");
      toast.success("saved");
      setTimeout(() => {
        navigate("/");
      }, 400);
    } catch (err) {
      toast.dismiss(publishingToast);
      e.target.classList.remove("disable");

      toast.error(err.message);
      console.log(err);
    }
  };
  return (
    <div>
      <Toaster />
      <div className="navbar">
        <Link to="/">
          <img src={logo} className="w-12 cursor-pointer object-cover"></img>
        </Link>
        <h1 className="max-md:hidden line-clamp-1 w-full capitalize">
          {blogState.title.length ? blogState.title : "New Blog"}
        </h1>
        <div className="flex gap-3 ml-auto">
          <button
            className="btn-light py-2"
            onClick={(e) => {
              saveDraftHandler(e);
            }}
          >
            Save Draft
          </button>
          <button className="btn-dark py-2" onClick={publishHandler}>
            Publish
          </button>
        </div>
      </div>
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative bg-grey aspect-video">
              <label htmlFor="blog-banner">
                <img src={blogState.banner} onError={errorHandler}></img>
                <input
                  type="file"
                  hidden
                  id="blog-banner"
                  accept=".png, .jpeg, .jpg"
                  onChange={imgUploadHandler}
                ></input>
              </label>
            </div>
          </div>
          <textarea
            placeholder="Blog Title"
            defaultValue={blogState.title}
            className="w-full  text-center mt-10 resize-none font-bold text-black text-4xl capitalize outline-none h-20 leading-tight placeholder:text-black placeholder:opacity-60"
            onKeyDown={keyDownHandler}
            onChange={heightHandler}
          ></textarea>
          <div id="textEditor"></div>
        </section>
      </AnimationWrapper>
    </div>
  );
};

export default BlogEditor;

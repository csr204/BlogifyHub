import React, { createContext, useContext, useEffect, useState } from "react";
import userContext from "../common/Context";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import Publish from "../components/publish-form.component";
import Loader from "../components/loader.component";

const blogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  des: "",
  author: { personal_info: {} },
};
export const blogContext = createContext();
const Editor = () => {
  const { id: blog_id } = useParams();
  // console.log(blog_id);
  const [blogState, setBlogState] = useState(blogStructure);
  const {
    message: { token },
  } = useContext(userContext).isLoggedIn;
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [Loading, setLoading] = useState(true);
  const fetchDetails = () => {
    fetch(import.meta.env.VITE_SERVER + `/blogs/read/${blog_id}`, {
      method: "POST",
      body: {
        mode: "edit",
        draft: false,
      },
    })
      .then((blog) => {
        blog
          .json()
          .then((blogres) => {
            console.log(blogres);
            setBlogState(blogres.message);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setBlogState(blogStructure);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!blog_id) setLoading(false);
    else {
      fetchDetails();
    }
  }, []);
  return (
    <blogContext.Provider
      value={{
        blogState,
        setBlogState,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {!token ? (
        <>
          {/* <Toaster /> */}
          <Navigate to={"/signIn"}></Navigate>
        </>
      ) : Loading ? (
        <Loader />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <Publish />
      )}
    </blogContext.Provider>
  );
};

export default Editor;

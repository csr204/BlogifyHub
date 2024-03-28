import { Navigate, Route, Routes } from "react-router-dom";
// import Navbar from "./components/navbar.component";
import Account from "./pages/userAuthForm.page";
import Home from "./pages/home.page";
import userContext from "./common/Context";
import { useEffect, useState } from "react";
import { getSessionStorage } from "./common/session";
import Editor from "./pages/editor.pages";
import Navbar from "./components/navbar.component";
import Search from "./pages/search.page";
import NotFound from "./pages/404.page";
import Profile from "./pages/profile.page";
import EditProfile from "./pages/edit-profile.page";
import BlogPage from "./pages/blog.page";
import SideBar from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import Notification from "./pages/notifications.page";
import ManageBlogs from "./pages/manage-blogs.page";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState({
    message: {
      token: null,
      user: { username: "", profile_img: "", fullname: "" },
    },
  });

  const [showSearch, setSearchStatus] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const user = getSessionStorage("user");
    // console.log(user);
    if (user) {
      setIsLoggedIn({ message: JSON.parse(user) });
    } else {
      setIsLoggedIn({
        message: {
          token: null,
          user: { username: "", fullname: "", profile_img: "" },
        },
      });
    }
  }, []);
  return (
    <userContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        showSearch,
        setSearchStatus,
        darkMode,
        setDarkMode,
      }}
    >
      <Routes>
        <Route path="/editor/" element={<Editor />}></Route>
        <Route path="/editor/:id" element={<Editor />}></Route>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />}></Route>
          <Route path="/signin" element={<Account type={"sign-in"} />}></Route>
          <Route path="/signup" element={<Account type={"sign-up"} />}></Route>
          <Route path="/dashboard" element={<SideBar />}>
            <Route path="/dashboard/blogs" element={<ManageBlogs />}></Route>
            <Route
              path="/dashboard/notifications"
              element={<Notification />}
            ></Route>
          </Route>
          <Route path="/settings" element={<SideBar />}>
            <Route
              path="/settings/change-password"
              element={<ChangePassword />}
            ></Route>
            <Route
              path="/settings/edit-profile"
              element={<EditProfile />}
            ></Route>
          </Route>
          <Route path="/search/:query" element={<Search />} />
          <Route path="/user/:id" element={<Profile />}></Route>
          {/* <Route path="user/edit/:id" element={<EditProfile />}></Route> */}
          <Route path="/blog/:id" element={<BlogPage />}></Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </userContext.Provider>
  );
};
export default App;

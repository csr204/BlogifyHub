import AnimationWrapper from "../common/AnimationWrapper";
import Input from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import userContext from "../common/Context";
import { addsessionStorage } from "../common/session";
import googleAuth from "../common/firebase";
const Account = ({ type }) => {
  const userctx = useContext(userContext);
  // console.log(userctx.isLoggedIn.token);
  const navigate = useNavigate();
  const formRef = useRef();
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
  const submitDetails = async (apiRoute, formData) => {
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER + "/auth" + apiRoute,
        formData
      );
      // console.log(data.message);
      addsessionStorage("user", JSON.stringify(data.message));

      // console.log(data.message.token);
      // userctx.setIsLoggedIn(true);
      const toastId = toast.success("done");
      if (type === "sign-up") {
        setTimeout(() => {
          toast.dismiss(toastId);
          navigate("/signin");
        }, 500);
        return;
      }
      // console.log(data.message);
      userctx.setIsLoggedIn({ message: data.message });
    } catch ({ response }) {
      console.log(response);
      // console.log(response.data.message);
      toast.error(response.data.message);
    }
  };

  const authHandler = (e) => {
    e.preventDefault();
    const form = new FormData(formRef.current);
    const formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    const { email, password } = formData;
    // console.log(formData);
    if (!email || email.length < 3 || !emailRegex.test(email)) {
      toast.error("email length should be atleast 3");
      return;
    }
    if (!password || password.length < 6 || !passwordRegex.test(password)) {
      toast.error(
        "password must be atleast 6 characters with atleast one uppercase,digit  "
      );
      return;
    }
    const apiRoute = type === "sign-in" ? "/login" : "/register";
    try {
      submitDetails(apiRoute, formData);
    } catch (err) {
      toast.error(response.data.message);
    }
  };

  const [passwordStatus, setPasswordStatus] = useState(false);
  const showPasswordHandler = () => {
    setPasswordStatus((prev) => !prev);
  };

  const sigInWithGoogle = async (e) => {
    e.preventDefault();
    const user = await googleAuth();
    // console.log(user);
    try {
      const responseFromBackend = await axios.post(
        import.meta.env.VITE_SERVER + "/auth/google",
        JSON.stringify(user),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { message } = responseFromBackend.data;
      // console.log(message);
      addsessionStorage("user", JSON.stringify(message));
      userctx.setIsLoggedIn({
        message: { token: message.token, user: message.user },
      });
    } catch (err) {
      const { response } = err;
      return toast.error(response.data.message);
    }
  };

  return userctx.isLoggedIn.message.token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cove flex align-center justify-center">
        <Toaster />
        <form className="w-[80%] max-w-[400px]" ref={formRef}>
          <h1 className="text-4xl font-gelasio capitalize text-center mb-10">
            {type === "sign-in" ? "Welcome Back" : "Join us Today"}
          </h1>
          {type !== "sign-in" ? (
            <div className="relative">
              <i className="ri-user-line text-2xl absolute top-[18%] left-[2%] z-10"></i>
              <Input
                type="text"
                placeholder="fullname"
                className="input-box"
                name="fullname"
              />
            </div>
          ) : (
            ""
          )}
          <div className="relative">
            <i className="ri-mail-line text-2xl absolute top-[18%] left-[2%] z-10"></i>
            <Input
              type="email"
              placeholder="email"
              className="input-box"
              name="email"
            ></Input>
          </div>
          <div className="relative">
            <i className="ri-key-2-line text-2xl absolute top-[18%] left-[2%] z-10"></i>
            <Input
              type={passwordStatus === true ? "text" : "password"}
              placeholder="password"
              className="input-box"
              name="password"
            ></Input>
            <i
              className={`${
                passwordStatus === false ? "ri-eye-line " : "ri-eye-off-line "
              } absolute top-3 right-3 text-2xl cursor-pointer`}
              onClick={showPasswordHandler}
            ></i>
          </div>
          <button className="btn-dark py-2 center mt-14" onClick={authHandler}>
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </button>
          <div className="w-full relative flex  items-center gap-2 mt-10">
            <hr className="w-[45%]"></hr>
            OR
            <hr className="w-[45%]"></hr>
          </div>
          <button
            className="w-full btn-dark mt-8 relative flex items-center justify-center gap-4"
            onClick={sigInWithGoogle}
          >
            <img src={googleIcon} className="w-8"></img>
            Continue with Google
          </button>
          {type === "sign-in" ? (
            <p className="mt-5 text-dark-grey text-xl text-center">
              New? Join us today{" "}
              <Link to="/signup" className="underline text-black">
                Signup
              </Link>
            </p>
          ) : (
            <p className="mt-5 text-dark-grey text-xl text-center">
              Already have an account?
              <Link to="/signin" className="underline text-black">
                Signin
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};
export default Account;

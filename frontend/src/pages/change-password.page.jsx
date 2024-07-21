import React, { useContext, useRef, useState } from "react";
import AnimationWrapper from "../common/AnimationWrapper";
import Input from "../components/input.component";
import toast, { Toaster } from "react-hot-toast";
import userContext from "../common/Context";

const ChangePassword = () => {
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const formRef = useRef();
  const userCtx = useContext(userContext);
  const {
    message: { token },
  } = userCtx.isLoggedIn;
  const changePasswordHandler = async (e) => {
    const data = new FormData(formRef.current);
    const formData = {};
    for (let [key, value] of data.entries()) {
      formData[key] = value;
    }
    const { currentPassword, newPassword } = formData;
    console.log(currentPassword, newPassword);
    if (!currentPassword || !newPassword)
      return toast.error("fill out all the fields");
    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return toast.error(
        "password must contain atleast one capital letter and a special charcter"
      );
    }

    e.target.setAttribute("disabled", true);
    const loadingToast = toast.loading("Updating...");
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER + "/users/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            newPassword,
            currentPassword,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response status:", response.status);

      const { message } = await response.json();
      if (!response.ok) {
        throw new Error(message);
      }
      toast.dismiss(loadingToast);
      toast.success(message);
    } catch (error) {
      console.error("Error:", error);
      toast.dismiss(loadingToast);
      toast.error(error.message);
    } finally {
      e.target.removeAttribute("disabled");
    }
  };
  return (
    <AnimationWrapper>
      <Toaster />
      <form ref={formRef} className="max-md:px-5">
        <h1 className="max-md:hidden mb-8">Change Password</h1>
        <div>
          <div className="relative  md:max-w-[350px] max-md:mt-8">
            <i className="ri-lock-2-fill absolute top-[11px] left-3 text-xl z-10 "></i>
            <Input
              placeholder="current password"
              type={showCurrentPassword ? "text" : "password"}
              className="input-box"
              name="currentPassword"
            ></Input>
            <i
              className={`ri-eye${
                showCurrentPassword ? "-off" : ""
              }-line absolute right-4 top-[10px] text-[18px] cursor-pointer`}
              onClick={() => {
                setShowCurrentPassword((prev) => !prev);
              }}
            ></i>
          </div>
          <div className="relative md:max-w-[350px]">
            <i className="ri-lock-2-fill absolute top-[11px] left-3 text-xl z-10 "></i>
            <Input
              placeholder="new password"
              type={showNewPassword ? "text" : "password"}
              className="input-box"
              name="newPassword"
            ></Input>
            <i
              className={`ri-eye${
                showNewPassword ? "-off" : ""
              }-line absolute right-4 top-[10px] text-[18px] cursor-pointer`}
              onClick={(e) => {
                setShowNewPassword((prev) => !prev);
              }}
            ></i>
          </div>
        </div>
        <button
          type="submit"
          className="btn-dark px-6 py-2 text-[12px] mt-2"
          onClick={(e) => {
            e.preventDefault();
            changePasswordHandler(e);
          }}
        >
          change password
        </button>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;

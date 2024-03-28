// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWH28dLqjZsUcfUtL3VhHLd-ewDzOeQYA",
  authDomain: "blogs-c751e.firebaseapp.com",
  projectId: "blogs-c751e",
  storageBucket: "blogs-c751e.appspot.com",
  messagingSenderId: "133519646927",
  appId: "1:133519646927:web:084b9d5735340fd7fdd7ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const googleAuth = async () => {
  let user = null;
  try {
    const googleUser = await signInWithPopup(auth, provider);
    user = googleUser.user;
  } catch (err) {
    console.log(err);
  }
  return user;
};
export default googleAuth;

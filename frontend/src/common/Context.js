import { createContext } from "react";

const userContext = createContext({
  isLoggedIn: {},
  setIsLoggedIn: () => {},
});
export default userContext;

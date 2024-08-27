import { createContext, useState } from "react";

export const AuthContext = createContext({
  token: "",
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState();

  function signIn(token) {
    setUserToken(token);
  }

  function signOut() {
    setUserToken(null);
  }

  const value = {
    token: userToken,
    isSignedIn: !!userToken,
    signIn: signIn,
    signOut: signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;

import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

async function deleteItemFor(key) {
  await SecureStore.deleteItemAsync(key);
}

export const AuthContext = createContext({
  token: "",
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState();

  useEffect(() => {
    async function fetchToken() {
      const userToken = await getValueFor("userToken");

      if (userToken) {
        setUserToken(userToken);
      }
    }
    fetchToken();
  }, []);

  function signIn(token) {
    setUserToken(token);
    save("userToken", token);
  }

  function signOut() {
    setUserToken(null);
    deleteItemFor("userToken");
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

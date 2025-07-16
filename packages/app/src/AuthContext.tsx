import {
  useRef,
  useState,
  type ReactNode,
  useEffect,
  useContext,
  createContext,
} from "react";

import * as auth from "./lib/auth";

interface AuthContextType {
  loaded: boolean;
  loggedIn: boolean;
  token: string | undefined;
  logout: () => void;
  login: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const initializing = useRef(true);
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const token = useRef<string | undefined>(undefined);

  useEffect(() => {
    const hash = new URLSearchParams(location.search.slice(1));
    const code = hash.get("code");
    const state = hash.get("state");

    if (!initializing.current) {
      return;
    }

    initializing.current = false;

    if (code && state) {
      callback(code, state);
      return;
    }

    authenticate();
  }, []);

  async function authenticate() {
    const token = await refreshTokens();
  
    if (token) {
      setLoggedIn(true);
    }
  
    setLoaded(true);
  }
  
  async function refreshTokens() {
    const nextToken = await auth.getToken();
    if (!nextToken) {
      return
    }

    token.current = nextToken;
    return nextToken;
  }
  
  async function getToken() {
    const token = await refreshTokens();
  
    if (!token) {
      await login();
      return;
    }
  
    return token;
  }
  
  async function login() {
    const url = await auth.login();
    location.href = url;
  }

  async function callback(code: string, state: string) {
    if (code) {
      const newToken = await auth.callback(code, state);
      if (newToken) {
        token.current = newToken;
      }
      window.location.replace("/");
    }
  }

  function logout() {
    token.current = auth.logout()
    setLoggedIn(false)
    auth.login()
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        loaded,
        token: token.current,
        loggedIn,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

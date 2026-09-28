import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginRequest, signupRequest } from "../api/auth";

const TOKEN_KEY = "fittrack_token";
const USER_KEY = "fittrack_user";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const persist = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (emailOrPhone, password) => {
      const data = await loginRequest({ emailOrPhone, password });
      persist(data.token, data.user);
      return data.user;
    },
    [persist]
  );

  const signup = useCallback(
    async (payload) => {
      const data = await signupRequest(payload);
      persist(data.token, data.user);
      return data.user;
    },
    [persist]
  );

  useEffect(() => {
    let cancelled = false;

    const validate = async () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        setLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        if (!cancelled) {
          localStorage.setItem(USER_KEY, JSON.stringify(me));
          setUser(me);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    validate();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout }),
    [user, token, loading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export default AuthContext;

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, login as loginApi, logout as logoutApi } from "../api/auth";
import { registerUser } from "../api/user";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string | null;
  role: string | null;
}

interface AuthContextType {
  accessToken: string | null;
  userEmail: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "foodexpress.auth";

const readStoredState = (): AuthState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null, userEmail: null, role: null };
    return JSON.parse(raw) as AuthState;
  } catch {
    return { accessToken: null, refreshToken: null, userEmail: null, role: null };
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => readStoredState());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!state.accessToken || state.role) return;
    const hydrate = async () => {
      try {
        const user = await fetchMe(state.accessToken!);
        setState((prev) => ({
          ...prev,
          userEmail: user.email,
          role: user.role,
        }));
      } catch {
        // ignore - token might be expired
      }
    };
    hydrate();
  }, [state.accessToken, state.role]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const tokens = await loginApi(email, password);
      const user = await fetchMe(tokens.accessToken);
      setState({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
        userEmail: user.email,
        role: user.role,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    setIsLoading(true);
    try {
      await registerUser({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi(state.refreshToken ?? undefined);
    } finally {
      setState({ accessToken: null, refreshToken: null, userEmail: null, role: null });
      setIsLoading(false);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      accessToken: state.accessToken,
      userEmail: state.userEmail,
      role: state.role,
      isAuthenticated: Boolean(state.accessToken),
      isLoading,
      login,
      register,
      logout,
    }),
    [state.accessToken, state.userEmail, state.role, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


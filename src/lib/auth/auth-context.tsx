/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/lib/auth/auth-storage";
import {
  getToken,
  setToken,
  setUser,
  clearAuth,
} from "@/lib/auth/auth-storage";
import { loginApi, getCurrentUser } from "@/lib/api/auth-api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  hasPermission: (perm: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function FullScreenSpinner() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[hsl(var(--background))]">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
        <p className="text-sm text-zinc-400">Đang tải...</p>
      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((u) => {
        setUserState(u);
        setUser(u);
      })
      .catch(() => {
        clearAuth();
        setUserState(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Listen for global logout event (fired by apiFetch on 401)
  useEffect(() => {
    const handler = () => {
      clearAuth();
      setUserState(null);
    };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await loginApi(email, password);
    setToken(response.token);
    setUser(response.user);
    setUserState(response.user);
  };

  const logout = () => {
    clearAuth();
    setUserState(null);
  };

  const hasPermission = (perm: string): boolean => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return user.permissions?.includes(perm) ?? false;
  };

  const value: AuthContextValue = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.role === "admin",
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <FullScreenSpinner /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

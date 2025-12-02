import { AuthState, User } from "@/types";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType extends AuthState {
  login: (loginData: { user: User; accessToken?: string; refreshToken?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const loadStoredAuth = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("@auth_user");
      const storedToken = localStorage.getItem("@auth_token");
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        // Clear invalid auth data
        localStorage.removeItem("@auth_user");
        localStorage.removeItem("@auth_token");
        localStorage.removeItem("@auth_refresh_token");
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("Error loading stored auth:", error);
      localStorage.removeItem("@auth_user");
      localStorage.removeItem("@auth_token");
      localStorage.removeItem("@auth_refresh_token");
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadStoredAuth();
    })();
  }, [loadStoredAuth]);

  const login = async (loginData: { user: User; accessToken?: string; refreshToken?: string }) => {
    try {
      const { user, accessToken, refreshToken } = loginData;
      
      localStorage.setItem("@auth_user", JSON.stringify(user));
      
      if (accessToken) {
        localStorage.setItem("@auth_token", accessToken);
      }
      
      if (refreshToken) {
        localStorage.setItem("@auth_refresh_token", refreshToken);
      }
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error storing user data:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("@auth_user");
      localStorage.removeItem("@auth_token");
      localStorage.removeItem("@auth_refresh_token");

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      localStorage.setItem("@auth_user", JSON.stringify(updatedUser));
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

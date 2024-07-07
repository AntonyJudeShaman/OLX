import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export interface User {
  id?: string;
  uid?: string;
  email?: string;
  name?: string;
  displayName?: string;
  username?: string;
  phone?: string;
  location?: string;
  profilePicture?: string;
  userType?: string;
  hashedPassword?: string;
  banners?: string[];
  wishlistItems?: string[];
}

const AuthContext = createContext<User | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/${firebaseUser.uid}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }
          const userDetails = await response.json();

          const completeUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            displayName: firebaseUser.displayName ?? "",
            ...userDetails,
          };

          setUser(completeUser);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext } from "react";

export const UserContext = createContext(undefined);

export const USER_SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? "http://localhost:5000";

export function useUserData() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("userData phải được dùng bên trong UserProvider");
  }
  return context;
}

export const userData = useUserData;

import { User } from "./user";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
  };

export { AuthContextType };
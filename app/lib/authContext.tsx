import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { useRouter, useSegments } from 'expo-router';
import { Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { User } from '@/app/types/user';
import { AuthContextType } from '@/app/types/authContext';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => {},
  createAccount: async () => {},
  signOut: async () => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/auth');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);


  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Email/password sign-in error:', error);
      let errorMessage = 'Failed to sign in. Please check your email and password.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      Alert.alert('Sign-In Error', errorMessage);
      throw error;
    }
  };

  const createAccount = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Account creation error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      
      // Provide more specific error messages for common Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use. Please use a different email or sign in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check and try again.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.code === 'auth/api-key-not-valid') {
        errorMessage = 'Your Firebase API key is invalid. Please check your configuration.';
      }
      
      Alert.alert('Account Creation Error', errorMessage);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Sign-Out Error', 'Failed to sign out.');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        signInWithEmail,
        createAccount, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider; 
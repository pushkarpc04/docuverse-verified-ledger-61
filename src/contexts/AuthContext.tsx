
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  id: string;
  email: string;
  role: 'user' | 'institute';
  firstName: string;
  lastName: string;
  instituteName?: string;
  verified: boolean;
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, userData: Omit<UserData, 'id' | 'createdAt'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, userInfo: Omit<UserData, 'id' | 'createdAt'>) => {
    try {
      console.log('Starting signup process for:', email);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', user.uid);
      
      // Update the user's display name
      await updateProfile(user, {
        displayName: `${userInfo.firstName} ${userInfo.lastName}`
      });
      console.log('Display name updated');

      // Create user document in Firestore - only include instituteName if it exists
      const newUserData: UserData = {
        id: user.uid,
        email: user.email!,
        createdAt: new Date().toISOString(),
        role: userInfo.role,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        verified: userInfo.verified,
        ...(userInfo.instituteName && { instituteName: userInfo.instituteName })
      };

      console.log('Attempting to save user data to Firestore:', newUserData);
      await setDoc(doc(db, 'users', user.uid), newUserData);
      console.log('User data saved to Firestore successfully');
      setUserData(newUserData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Starting login process for:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process');
      await signOut(auth);
      setUserData(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.uid}` : 'User logged out');
      setCurrentUser(user);
      
      if (user) {
        try {
          console.log('Fetching user data from Firestore for:', user.uid);
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            console.log('User data fetched successfully:', userData);
            setUserData(userData);
          } else {
            console.log('No user document found in Firestore, creating minimal user data');
            // If no document exists, create minimal user data from auth user
            const minimalUserData: UserData = {
              id: user.uid,
              email: user.email || '',
              role: 'user',
              firstName: user.displayName?.split(' ')[0] || 'User',
              lastName: user.displayName?.split(' ')[1] || '',
              verified: true,
              createdAt: new Date().toISOString()
            };
            setUserData(minimalUserData);
          }
        } catch (error: any) {
          console.error('Error fetching user data from Firestore:', error);
          
          // If it's a permission error, create minimal user data from auth user
          if (error.code === 'permission-denied') {
            console.log('Permission denied, using auth user data only');
            const minimalUserData: UserData = {
              id: user.uid,
              email: user.email || '',
              role: 'user',
              firstName: user.displayName?.split(' ')[0] || 'User',
              lastName: user.displayName?.split(' ')[1] || '',
              verified: true,
              createdAt: new Date().toISOString()
            };
            setUserData(minimalUserData);
          } else {
            setUserData(null);
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

'use client';

import React, { createContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '@/util/firebaseConfig';

type AuthContextType = {
  user: User | null;
  googleSignIn: () => void;
  logOut: () => void;
  fetchWithToken: (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object) => Promise<Response>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  googleSignIn: () => {},
  logOut: () => {},
  fetchWithToken: async () => new Response(),
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  const fetchWithToken = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body: object = {}) => {
    const token = await user?.getIdToken();
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      ...(body && (method === 'POST' || method === 'PUT' || method === 'DELETE') && { body: JSON.stringify(body) }),
    };

    const response = await fetch(url, options);
    return response;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, googleSignIn, logOut, fetchWithToken }}>{children}</AuthContext.Provider>;
};

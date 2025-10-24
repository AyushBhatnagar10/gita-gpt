'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, getUserData } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from '@/lib/api-services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [backendSynced, setBackendSynced] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get Firebase ID token
          const idToken = await user.getIdToken();
          setToken(idToken);
          
          // Get user data from Firebase
          const result = await getUserData(user.uid);
          if (result.success) {
            setUserData(result.data);
          }
          
          // Sync with backend
          try {
            await authService.login(user, idToken);
            setBackendSynced(true);
            console.log('Successfully synced with backend');
          } catch (error) {
            console.error('Error syncing with backend:', error);
            setBackendSynced(false);
            // Still set user even if backend sync fails
          }
        } catch (error) {
          console.error('Error getting token or user data:', error);
          setToken(null);
          setBackendSynced(false);
        }
      } else {
        setUserData(null);
        setToken(null);
        setBackendSynced(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    token,
    backendSynced,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
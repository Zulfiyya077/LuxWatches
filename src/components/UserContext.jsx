import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          
          // Burada 'profiles' cədvəlini istifadə etməyəcəyik, yalnız `auth`dan istifadə edəcəyik
          if (user.user_metadata && user.user_metadata.username) {
            setUserName(user.user_metadata.username);  // `user_metadata`dan username əldə edirik
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);

          // Burada da `profiles` cədvəlindən məlumat çəkmirik, yalnız `user_metadata`dan istifadə edirik
          if (session.user.user_metadata && session.user.user_metadata.username) {
            setUserName(session.user.user_metadata.username);  // `user_metadata`dan username əldə edirik
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserName('');
        }
      }
    );

    getUserData();

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setUserName('');
      }
      return { error };
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    userName,
    loading,
    logout,
    isAuthenticated: !!user
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;

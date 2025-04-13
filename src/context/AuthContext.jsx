import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);

          // `user_metadata` istifadə edərək məlumatları almaq
          const { user_metadata } = user;
          setUserName(user_metadata?.username || '');
          setIsAdmin(user_metadata?.role === 'admin');
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

          // `user_metadata`-dan məlumatları almaq
          const { user_metadata } = session.user;
          setUserName(user_metadata?.username || '');
          setIsAdmin(user_metadata?.role === 'admin');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserName('');
          setIsAdmin(false);
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
        setIsAdmin(false);
      }
      return { error };
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    userName,
    isAdmin,
    loading,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

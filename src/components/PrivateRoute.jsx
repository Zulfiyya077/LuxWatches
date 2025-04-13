import React from 'react';
import { Navigate } from 'react-router-dom';
import supabase from '../../supabaseClient';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const user = supabase.auth.getUser();
  

  if (!user) {
    return <Navigate to="/login" replace />;
  }

 
  if (adminOnly) {
    const isAdmin = checkUserIsAdmin(user);
    if (!isAdmin) {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

const checkUserIsAdmin = async (user) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return data?.role === 'admin';
};

export default PrivateRoute;
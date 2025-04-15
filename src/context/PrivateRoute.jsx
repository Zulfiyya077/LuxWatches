import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import supabase from '../supabaseClient';
import { useUser } from '../components/UserContext';


const ADMIN_EMAIL = "mammadli.zulfiyya77@gmail.com";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useUser();
  const [isAdminInProfiles, setIsAdminInProfiles] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdminInProfiles = async () => {
      if (user && adminOnly) {
        try {
     
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id);

          if (error) {
            console.error('Profiles cədvəlində yoxlama xətası:', error);
          } else if (data && data.length > 0) {
           
            setIsAdminInProfiles(data[0].role === 'admin');
          } else {
            console.log('İstifadəçi profiles cədvəlində tapılmadı');
          }
        } catch (err) {
          console.error('Admin rolu yoxlaması zamanı xəta:', err);
        }
      }
      setLoading(false);
    };

    checkAdminInProfiles();
  }, [user, adminOnly]);


  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly) {
 
    const isAdmin = user?.email === ADMIN_EMAIL || isAdminInProfiles;
    
    if (!isAdmin) {
   
      return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default PrivateRoute;
import React, { useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import OrderTracking from '../../components/Track/Track';
import styles from './Orders.module.css';

const Orders = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
  
    window.scrollTo(0, 0);
    document.title = 'Sifarişlərim';
  }, []);

  return (
    <div className={`${styles.ordersPage} ${theme === 'dark' ? styles.ordersPageDark : ''}`}>
      <OrderTracking />
    </div>
  );
};

export default Orders;
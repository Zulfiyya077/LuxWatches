import React, { useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import OrderTracking from '../../components/Track/Track';
import styles from './Orders.module.css';

const Orders = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Sifarişlərim';
  }, []);

  return (
    <div className={styles.container} data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className={styles.ordersWrapper}>
        <div className={styles.headerSection}>
          <div className={styles.logo}>
          <img width="200px" src="/public/videos/Screenshot Capture - 2025-04-14 - 02-25-33-Photoroom.png"/>
          </div>
          
          <div className={styles.separator}></div>
        </div>
        
        <div className={styles.ordersContent}>
          <OrderTracking />
        </div>
      </div>
    </div>
  );
};

export default Orders;
import React, { useEffect } from 'react';
import styles from './Alert.module.css';

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>X</button>
    </div>
  );
};

export default Alert;

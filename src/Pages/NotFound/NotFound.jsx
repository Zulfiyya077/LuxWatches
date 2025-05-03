import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./NotFound.module.css";
import { ThemeContext } from "../../context/ThemeContext";

const luxuryWatches = [
  "/public/images/rolex404.webp",
  "/public/images/404.1.webp",
  "/public/images/404.3.webp",
  "/public/images/404.4.webp",
  "/public/images/404.6.webp"
];

const NotFound = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const [currentWatch, setCurrentWatch] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWatch((prev) => (prev + 1) % luxuryWatches.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container} data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className={styles.errorWrapper}>
        <div className={styles.errorContent}>
          <div className={styles.logo}>
            <span className={styles.logoText}>{t("common.companyName.luxury") || "Luxury"}</span>
          </div>
          
          <h1 className={styles.title}>{t("errorTitle") || "Page Not Found"}</h1>
          
          <div className={styles.errorDigits}>
            <span className={styles.digit4}>4</span>
            <div className={styles.zeroContainer}>
              {luxuryWatches.map((watch, index) => (
                <img 
                  key={watch}
                  src={watch} 
                  alt={`Luxury Watch ${index + 1}`} 
                  className={`
                    ${styles.watchImage} 
                    ${index === currentWatch ? styles.activeWatch : styles.inactiveWatch}
                  `}
                />
              ))}
            </div>
            <span className={styles.digit4}>4</span>
          </div>
          
          <p className={styles.errorMessage}>{t("notFoundMessage") || "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}</p>
          
          <Link to="/" className={styles.luxuryButton}>
            {t("backToHome") || "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
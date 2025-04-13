import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./NotFound.module.css";

const luxuryWatches = [
  "/public/images/rolex404.webp",
  "/public/images/404.1.webp",
  "/public/images/404.3.webp",
  "/public/images/404.4.webp",
  "/public/images/404.6.webp"
];

const NotFound = () => {
  const { t } = useTranslation();
  const [currentWatch, setCurrentWatch] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWatch((prev) => (prev + 1) % luxuryWatches.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.luxuryContainer}>
      <div className={styles.errorWrapper}>
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
        <h1 className={styles.errorTitle}>{t("errorTitle")}</h1>
        <p className={styles.errorMessage}>{t("notFoundMessage")}</p>
        <div className={styles.actionContainer}>
          <Link to="/" className={styles.luxuryButton}>
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
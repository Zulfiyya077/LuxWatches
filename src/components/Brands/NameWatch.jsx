
import React from "react";
import styles from "./NameWatch.module.css";

const NameWatch = () => {
  const watchBrands = ["Rolex", "Daytona", "Submariner", "Oyster Perpetual", "Datejust", "Explorer"]; 

  return (
    <div className={styles.nameWatchWrapper}>
      <div className={styles.marquee}>
        {watchBrands.map((brand, index) => (
          <span key={index} className={styles.marqueeItem}>{brand}</span>
        ))}
      </div>
    </div>
  );
};

export default NameWatch;

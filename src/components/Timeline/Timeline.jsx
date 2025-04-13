import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Timeline.module.css";

const Timeline = ({ darkMode }) => {
  const { t } = useTranslation();

  const history = [
    { year: "2010", event: t("event1") },
    { year: "2015", event: t("event2") },
    { year: "2020", event: t("event3") },
  ];

  return (
    <section className={`${styles.timelineSection} ${darkMode ? styles.dark : ""}`}>
      <h2 className={styles.sectionTitle}>{t("companyHistory")}</h2>
      <div className={styles.timeline}>
        {history.map((item, index) => (
          <div key={index} className={styles.timelineItem}>
            <span className={styles.year}>{item.year}</span>
            <p className={styles.event}>{item.event}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;

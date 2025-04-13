import React, { useEffect, useRef, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "./AboutSection.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);
  const frameId = useRef(null);

  useEffect(() => {
    const animateCount = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;

      const percentage = Math.min(progress / duration, 1);
      const easeOutQuad = percentage * (2 - percentage);
      const currentCount = Math.floor(easeOutQuad * end);

      setCount(currentCount);

      if (progress < duration) {
        frameId.current = requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          frameId.current = requestAnimationFrame(animateCount);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      observer.disconnect();
    };
  }, [end, duration]);

  return <span ref={countRef}>{count}</span>;
};

const AboutSection = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("brand");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isVisible) {
        section.classList.add(styles.animate);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleClick = () => {
    navigate("/products");
  };
  return (
    <section
      ref={sectionRef}
      className={`${styles.aboutSection} ${
        theme === "dark" ? styles.darkMode : styles.lightMode
      }`}
    >
      <div className={styles.backgroundElements}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>{t("aboutUs")}</h2>
            <div className={styles.separator}></div>
            <div className={styles.imageWrapper}>
              <video
                src={"/videos/What makes a Rolex a Rolex？ (1).mp4"} 
                alt="Luxury Rolex Watch"
                className={styles.watchImage}
                controls
                loop
                muted
                playsInline
                autoPlay 
              />
            </div>
            <div className={styles.tabsContainer}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "brand" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("brand")}
                >
                  {t("aboutRolex")}
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "store" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("store")}
                >
                  {t("aboutStore")}
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "craftsmanship" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("craftsmanship")}
                >
                  {t("craftmanship")}
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === "brand" && (
                  <div>
                    <p className={styles.description}>
                      {t("rolexBrandHistory")}
                    </p>
                    <ul className={styles.factsList}>
                      <li>{t("rolexFact1")}</li>
                      <li>{t("rolexFact2")}</li>
                      <li>{t("rolexFact3")}</li>
                    </ul>
                  </div>
                )}

                {activeTab === "store" && (
                  <div>
                    <p className={styles.description}>
                      {t("storeDescription")}
                    </p>
                    <ul className={styles.factsList}>
                      <li>{t("storeFact1")}</li>
                      <li>{t("storeFact2")}</li>
                      <li>{t("storeFact3")}</li>
                    </ul>
                  </div>
                )}

                {activeTab === "craftsmanship" && (
                  <div>
                    <p className={styles.description}>
                      {t("craftsmanshipDescription")}
                    </p>
                    <ul className={styles.factsList}>
                      <li>{t("craftFact1")}</li>
                      <li>{t("craftFact2")}</li>
                      <li>{t("craftFact3")}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={1905} duration={2500} />
                </span>
                <span className={styles.statLabel}>{t("founded")}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={200} duration={2000} />+
                </span>
                <span className={styles.statLabel}>{t("patents")}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  <CountUp end={50} duration={1500} />+
                </span>
                <span className={styles.statLabel}>{t("countries")}</span>
              </div>
            </div>
            <button className={styles.discoverButton} onClick={handleClick}>
              {t("discoverCollection")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

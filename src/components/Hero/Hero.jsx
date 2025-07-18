import React, { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";  
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./Hero.module.css";
import video1 from "../../../public/videos/Rolex Explorer.mp4";
import video2 from "../../../public/videos/Rolex GMT-Master II.mp4";
import video3 from "../../../public/videos/Rolex Deepsea – Cerachrom ring.mp4";
// Import your existing ThemeContext - update the path to match yours
import { ThemeContext } from "../../context/ThemeContext";

const watchCollections = [
  {
    id: 1,
    name: "prestige_collection",
    description: "prestige_description",
    price: "prestige_price",
    features: ["feature_sapphire", "feature_automatic", "feature_water_50"]
  },
  {
    id: 2,
    name: "heritage_series",
    description: "heritage_description",
    price: "heritage_price",
    features: ["feature_gold", "feature_chronograph", "feature_water_100"]
  },
  {
    id: 3,
    name: "nautical_edition",
    description: "nautical_description",
    price: "nautical_price",
    features: ["feature_titanium", "feature_dive", "feature_water_300"]
  }
];

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); 
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Access your existing theme context
  // Make sure this matches the property name in your ThemeContext
  const { theme } = useContext(ThemeContext);
  // Determine if dark mode is active based on your theme context structure
  // Update this logic to match how your theme is stored in context
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    // Load Poppins font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleShopNowClick = () => {
    navigate('/products'); 
  };

  // Dynamic styles based on theme
  const themeClass = isDarkMode ? styles.darkTheme : styles.lightTheme;

  return (
    <div className={`${styles.heroContainer} ${themeClass}`}>
      <div className={styles.gradientOverlay}></div>

      <Swiper
        effect="cube"
        grabCursor={true}
        cubeEffect={{ shadow: true, slideShadows: true, shadowOffset: 50, shadowScale: 0.94 }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        modules={[EffectCube, Autoplay, Navigation, Pagination]}
        className={styles.swiper}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {[video1, video2, video3].map((video, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide}>
            <div className={styles.videoWrapper}>
              <video autoPlay loop muted playsInline className={styles.video}>
                <source src={video} type="video/mp4" />
                {t("video_not_supported")}
              </video>
              <div className={`${styles.videoOverlay} ${themeClass}`}></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <motion.div 
        className={`${styles.content} ${themeClass}`} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        <h1 className={`${styles.title} ${themeClass}`}>{t("hero_title")}</h1>
        <p className={`${styles.subtitle} ${themeClass}`}>{t("hero_subtitle")}</p>

        <div className={`${styles.watchDetails} ${themeClass}`} key={activeIndex}>
          <h2 className={`${styles.collectionName} ${themeClass}`}>{t(watchCollections[activeIndex].name)}</h2>
          <p className={`${styles.collectionDesc} ${themeClass}`}>{t(watchCollections[activeIndex].description)}</p>
          <p className={`${styles.price} ${themeClass}`}>{t(watchCollections[activeIndex].price)}</p>

          <ul className={styles.featuresList}>
            {watchCollections[activeIndex].features.map((feature, i) => (
              <li key={i} className={themeClass}>{t(feature)}</li>
            ))}
          </ul>
        </div>

        <div className={styles.ctaContainer}>
          <button className={`${styles.primaryBtn} ${themeClass}`} onClick={handleShopNowClick}>
            {t("shop_now")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
import React, { useState } from "react";
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


  const handleShopNowClick = () => {
    navigate('/products'); 
  };

  return (
    <div className={styles.heroContainer}>
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
              <div className={styles.videoOverlay}></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <motion.div className={styles.content} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <h1 className={styles.title}>{t("hero_title")}</h1>
        <p className={styles.subtitle}>{t("hero_subtitle")}</p>

        <div className={styles.watchDetails} key={activeIndex}>
          <h2 className={styles.collectionName}>{t(watchCollections[activeIndex].name)}</h2>
          <p className={styles.collectionDesc}>{t(watchCollections[activeIndex].description)}</p>
          <p className={styles.price}>{t(watchCollections[activeIndex].price)}</p>

          <ul className={styles.featuresList}>
            {watchCollections[activeIndex].features.map((feature, i) => (
              <li key={i}>{t(feature)}</li>
            ))}
          </ul>
        </div>

        <div className={styles.ctaContainer}>
          <button className={styles.primaryBtn} onClick={handleShopNowClick}>
            {t("shop_now")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;


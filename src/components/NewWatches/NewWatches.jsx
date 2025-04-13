import React, { useState, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart, FaAngleLeft, FaInfoCircle } from "react-icons/fa";
import styles from "./NewWatches.module.css";
import { ThemeContext } from "../../context/ThemeContext";

const NewWatches = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [flippedCards, setFlippedCards] = useState({});
  const [favorites, setFavorites] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const videoRefs = useRef({});

  const newModels = [
    // {
    //   id: 101,
    //   name: t('landDweller'),
    //   release: "2025",
    //   price: 68500,
    //   imgSrc: "/images/land-dweller.webp",
    //   videoSrc: "/videos/land-dweller.mp4",
    //   description: t('landDwellerDescription'),
    //   features: [t('deepSeaResistance'), t('heliumEscapeValve'), t('chronometerCertified')],
    //   material: "Oystersteel and Ceramic",
    //   movement: "Calibre 3235",
    //   waterResistance: "3900 meters",
    //   caseDiameter: "44mm",
    //   limited: true,
    //   limitedQuantity: 300,
    // },
    {
      id: 102,
      name: t('gmtMasterII'),
      release: "2025",
      price: 62000,
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/green.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvZ3JlZW4ud2VicCIsImlhdCI6MTc0NDMxMjIzNiwiZXhwIjoxNzc1ODQ4MjM2fQ.m82qub0H3wh9Z778YLknmeV79_j_uFa3xkzsHOpQf4g",
      videoSrc: "public/videos/Rolex new watches 2025 – The GMT-Master II.mp4",
      description: t('gmtMasterDescription'),
      features: [t('dualTimeZone'), t('cerachromBezel'), t('jubileeBracelet')],
      material: "Yellow Rolesor",
      movement: "Calibre 3285",
      waterResistance: "100 meters",
      caseDiameter: "40mm",
      limited: false,
      limitedQuantity: null,
    },
    {
      id: 103,
      name: t('oysterPerpetual'),
      release: "2025",
      price: 47000,
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/oyster.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvb3lzdGVyLmF2aWYiLCJpYXQiOjE3NDQzMTIxOTUsImV4cCI6MTc3NTg0ODE5NX0.71wCWGpaK0gwLgcUCFw5Ul7EbA0qla3Z6gjvaZ1mBvo",
      videoSrc: "public/videos/Rolex new watches 2025 – The Oyster Perpetual.mp4",
      description: t('oysterPerpetualDescription'),
      features: [t('superlativeChronometer'), t('colorfulDial'), t('paramagneticEscapeWheel')],
      material: "Oystersteel",
      movement: "Calibre 2232",
      waterResistance: "100 meters",
      caseDiameter: "36mm",
      limited: false,
      limitedQuantity: null,
    },
    {
      id: 104,
      name: t('rolex1908'),
      release: "2025",
      price: 89500,
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/1908.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvMTkwOC5hdmlmIiwiaWF0IjoxNzQ0MzEyMTYwLCJleHAiOjE3NzU4NDgxNjB9.Bzb39Zwj1Y-r9_zqDOObHKOt4yjxk574x_Vl90cmbu8",
      videoSrc: "public/videos/Rolex new watches 2025 – The 1908.mp4",
      description: t('rolex1908Description'),
      features: [t('slimCase'), t('openCaseBack'), t('handWoundElegance')],
      material: "18 ct Yellow Gold",
      movement: "Calibre 7140",
      waterResistance: "50 meters",
      caseDiameter: "39mm",
      limited: true,
      limitedQuantity: 150,
    },
    {
      id: 105,
      name: t('datejust2025'),
      release: "2025",
      price: 53000,
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/date2025.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvZGF0ZTIwMjUud2VicCIsImlhdCI6MTc0NDMxMjI1OSwiZXhwIjoxNzc1ODQ4MjU5fQ.QDtb9c3Y3Fm4wmP6Bc67sJNhuHQ6cK6pYJrxcqF5ie0",
      videoSrc: "public/videos/Rolex new watches 2025 – The Datejust.mp4",
      description: t('datejustDescription'),
      features: [t('flutedBezel'), t('dateCyclops'), t('classicDesign')],
      material: "White Rolesor",
      movement: "Calibre 3235",
      waterResistance: "100 meters",
      caseDiameter: "41mm",
      limited: false,
      limitedQuantity: null,
    }
  ];
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFlipCard = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddToFavorites = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    
    
    const element = document.getElementById(`favorite-${id}`);
    if (element) {
      element.classList.add(styles.favoriteAnimation);
      setTimeout(() => {
        element.classList.remove(styles.favoriteAnimation);
      }, 500);
    }
  };

  const handleMouseEnter = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].play();
    }
  };

  const handleMouseLeave = (id) => {
    if (videoRefs.current[id]) {
      videoRefs.current[id].pause();
      videoRefs.current[id].currentTime = 0;
    }
  };

  return (
    <section className={`${styles.newWatchesSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t('newTimepieces2025')}
          </motion.h2>
          <motion.div 
            className={styles.titleSeparator}
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
          <motion.p 
            className={styles.sectionSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {t('exclusiveReleases')}
          </motion.p>
        </div>
        
        <div className={styles.watchesGrid}>
          {newModels.map((model, index) => (
            <motion.div 
              key={model.id}
              className={styles.watchCard}
              onClick={() => handleFlipCard(model.id)}
              animate={isLoading ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              onMouseEnter={() => handleMouseEnter(model.id)}
              onMouseLeave={() => handleMouseLeave(model.id)}
            >
              <div className={`${styles.cardInner} ${flippedCards[model.id] ? styles.flipped : ''}`}>
                {/* Front Side - Watch Image/Video */}
                <div className={styles.cardFront}>
                  <div className={styles.mediaContainer}>
                    <img 
                      src={model.imgSrc}
                      alt={model.name} 
                      className={styles.watchImage}
                    />
                    <video 
                      ref={el => videoRefs.current[model.id] = el}
                      src={model.videoSrc}
                      muted
                      loop
                      playsInline
                      className={styles.watchVideo}
                    ></video>
                    <div className={styles.hoverInstruction}>
                      <FaInfoCircle /> {t('hoverForVideo')}
                    </div>
                    <div id={`favorite-${model.id}`} className={styles.favoriteButton} onClick={(e) => handleAddToFavorites(e, model.id)}>
                      {favorites[model.id] ? <FaHeart className={styles.favoriteActive} /> : <FaRegHeart />}
                    </div>
                    {model.limited && (
                      <div className={styles.limitedBadge}>
                        {t('limitedEdition')} {model.limitedQuantity}
                      </div>
                    )}
                    <div className={styles.luxuryBadge}>Rolex</div>
                    <div className={styles.releaseYearBadge}>{model.release}</div>
                  </div>
                  
                  <div className={styles.frontInfo}>
                    <h3 className={styles.watchName}>{model.name}</h3>
                    <p className={styles.watchPrice}>${model.price.toLocaleString()}</p>
                    <div className={styles.clickInstruction}>
                      <span>{t('tapToReveal')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Back Side - Watch Details */}
                <div className={styles.cardBack}>
                  <button 
                    className={styles.backButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlipCard(model.id);
                    }}
                  >
                    <FaAngleLeft /> {t('back')}
                  </button>
                  
                  <div className={styles.watchDetails}>
                    <h3 className={styles.watchNameBack}>{model.name}</h3>
                    
                    <div className={styles.featuresContainer}>
                      {model.features.map((feature, i) => (
                        <span key={i} className={styles.featureTag}>{feature}</span>
                      ))}
                    </div>
                    
                    <p className={styles.watchDescription}>{model.description}</p>
                    
                    <div className={styles.specificationGrid}>
                      <div className={styles.specItem}>
                        <span className={styles.specTitle}>{t('material')}</span>
                        <span className={styles.specValue}>{model.material}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specTitle}>{t('movement')}</span>
                        <span className={styles.specValue}>{model.movement}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specTitle}>{t('waterResistance')}</span>
                        <span className={styles.specValue}>{model.waterResistance}</span>
                      </div>
                      <div className={styles.specItem}>
                        <span className={styles.specTitle}>{t('caseDiameter')}</span>
                        <span className={styles.specValue}>{model.caseDiameter}</span>
                      </div>
                    </div>
                    
                    <div className={styles.priceInfoBack}>
                      <span className={styles.priceLabel}>{t('price')}</span>
                      <span className={styles.priceValueBack}>${model.price.toLocaleString()}</span>
                    </div>
                    
                    <div className={styles.availabilityInfo}>
                      {model.limited ? (
                        <span className={styles.limitedInfo}>
                          {t('limitedTo')} <strong>{model.limitedQuantity}</strong> {t('pieces')}
                        </span>
                      ) : (
                        <span className={styles.regularRelease}>{t('regularRelease')}</span>
                      )}
                    </div>
                  </div>
                  
                  <div id={`favorite-${model.id}-back`} className={styles.favoriteButtonBack} onClick={(e) => handleAddToFavorites(e, model.id)}>
                    {favorites[model.id] ? (
                      <>
                        <FaHeart className={styles.favoriteActive} /> {t('removeFromFavorites')}
                      </>
                    ) : (
                      <>
                        <FaRegHeart /> {t('addToFavorites')}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewWatches;
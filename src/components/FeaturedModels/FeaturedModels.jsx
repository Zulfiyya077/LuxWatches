import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInfoCircle, FaAngleLeft, FaTimes } from "react-icons/fa";
import styles from "./FeaturedModels.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { useCart } from "react-use-cart";

// Create a separate modal component to isolate re-renders
const NotifyMeModal = ({ isOpen, onClose, selectedModel, t, theme }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef(null);

  // Reset form when modal opens with a new model
  useEffect(() => {
    if (isOpen && selectedModel) {
      setFormData({ name: "", email: "" });
      setSubmitted(false);
    }
  }, [isOpen, selectedModel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Bildiriş formu göndərildi:", formData, "Məhsul:", selectedModel?.name);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  // Close on click outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className={`${styles.modalContent} ${theme === 'dark' ? styles.dark : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        
        {!submitted ? (
          <>
            <h3 className={styles.modalTitle}>
              {t('getNotified')} - {selectedModel?.name}
            </h3>
            <p className={styles.modalDescription}>
              {t('notifyMeDescription')}
            </p>
            
            <form onSubmit={handleSubmit} className={styles.notifyForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">{t('fullName')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('enterName')}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">{t('email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('enterEmail')}
                  required
                />
              </div>
              
              <button type="submit" className={styles.submitButton}>
                {t('notifyMe')}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.checkmarkContainer}>
              <div className={styles.checkmark}></div>
            </div>
            <h3>{t('thankYou2')}</h3>
            <p>{t('notificationSuccess')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FlippableWatches = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);  
  const { addItem } = useCart();
  const [flippedCards, setFlippedCards] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Modal state-lərini əlavə edirik
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const models = [
    {
      id: 1,
      name: t('rolexSubmariner'),
      slug: "rolex-submariner",
      price: 8500,
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/submarine.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvc3VibWFyaW5lLnBuZyIsImlhdCI6MTc0NDMxMzA3NywiZXhwIjoxNzc1ODQ5MDc3fQ.xCSS6_UoPeDFr4u0SYIdYT6C8OGbrBS2fvnrd5th0eU",
      description: t('submarinerDescription'),
      features: [t('waterResistant'), t('automaticMovement'), t('ceramicBezel')],
      material: "Oystersteel",
      dial: t('submarinerDial'),
      available: true
    },
    {
      id: 2,
      name: t('rolexDayDate'),
      slug: "rolex-day-date",
      price: 12000,
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/daydate.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvZGF5ZGF0ZS5hdmlmIiwiaWF0IjoxNzQ0MzEzMTQ3LCJleHAiOjE3NzU4NDkxNDd9.6zJ06D5K5yqJNGn6j-eTXL8Uv6u4qQ-6VKiJMKa253I",
      description: t('dayDateDescription'),
      features: [t('dayDateComplication'), t('flutedBezel'), t('prestigiousBracelet')],
      material: "18k Gold",
      dial: t('dayDateDial'),
      available: true
    },
    {
      id: 3,
      name: t('rolexGMTMaster'),
      slug: "rolex-gmt-master",
      price: 10500,
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/gmt.avif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvZ210LmF2aWYiLCJpYXQiOjE3NDQzMTMxODEsImV4cCI6MTc3NTg0OTE4MX0.afkvWWt0fHJsXc7rnWYIu2NHYfxGWcy_--lPiysvPWM",
      description: t('gmtDescription'),
      features: [t('dualTimeZone'), t('rotatingBezel'), t('24hourHand')],
      material: "Oystersteel and Everose gold",
      dial: t('gmtDial'),
      available: false
    },
    {
      id: 4,
      name: t('rolexRainbow'),
      slug: "rolex-rainbow",
      price: 150000,
      imgSrc: "https://xdzksswqqqoonxbwcmup.supabase.co/storage/v1/object/sign/Images/rainbbb.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJJbWFnZXMvcmFpbmJiYi5wbmciLCJpYXQiOjE3NDQzMTU1OTYsImV4cCI6MTc3NTg1MTU5Nn0.XlhD8OWGethCSsIk36JFq7PG7qElloualHSCZ4faR2o",
      description: t('rainbowDescription'),
      features: [t('diamondBezel'), t('luxuryDesign'), t('chronograph')],
      material: "18 ct Everose gold with rainbow sapphire bezel",
      dial: t('rainbowDial'),
      available: true
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFlipCard = useCallback((id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const handleAddToCart = useCallback((e, model) => {
    e.stopPropagation();
    
    if (!model.available) return;
    
    addItem({
      id: model.id,
      name: model.name,
      price: model.price,
      imgSrc: model.imgSrc,
      quantity: 1
    });
    
    const element = document.getElementById(`card-${model.id}`);
    if (element) {
      element.classList.add(styles.addedToCart);
      setTimeout(() => {
        element.classList.remove(styles.addedToCart);
      }, 1000);
    }
  }, [addItem]);
  
  // Function to open modal
  const handleNotifyClick = useCallback((e, model) => {
    e.stopPropagation();
    setSelectedModel(model);
    setIsModalOpen(true);
  }, []);
  
  // Function to close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Don't immediately clear the selected model to avoid UI jumps
    setTimeout(() => {
      setSelectedModel(null);
    }, 300); // Wait for modal close animation
  }, []);

  const handleViewDetails = useCallback((e, model) => {
    e.stopPropagation();
    navigate(`/products/${model.id}`);
  }, [navigate]);

  return (
    <section className={`${styles.watchesShowcase} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.sectionHeader}>
        <motion.h2 
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t('luxuryWatches')}
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
          {t('featuredSubtitle')}
        </motion.p>
      </div>
      
      <div className={styles.watchesGrid}>
        {models.map((model, index) => (
          <motion.div 
            key={model.id}
            id={`card-${model.id}`}
            className={`${styles.flipCard} ${!model.available ? styles.unavailable : ''}`}
            onClick={() => handleFlipCard(model.id)}
            animate={isLoading ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className={`${styles.flipCardInner} ${flippedCards[model.id] ? styles.flipped : ''}`}>
              {/* Front Side - Watch Image */}
              <div className={styles.flipCardFront}>
                <div className={styles.watchImageWrapper}>
                  <div className={styles.watchImageBg}></div>
                  <img 
                    src={model.imgSrc}
                    alt={model.name} 
                    className={styles.watchImage}
                  />

                  {!model.available && (
                    <div className={styles.unavailableBadge}>
                      {t('comingSoon')}
                    </div>
                  )}
                </div>
                
                <div className={styles.cardFooter}>
                  <h3 className={styles.watchName}>{model.name}</h3>
                  <p className={styles.watchPrice}>${model.price.toLocaleString()}</p>
                </div>
                
                <div className={styles.flipCardHint}>
                  <span>{t('tapForDetails')}</span>
                </div>
                
                <div className={styles.luxuryBadge}>
                  <span>Rolex</span>
                </div>
              </div>
              
              {/* Back Side - Watch Details */}
              <div className={styles.flipCardBack}>
                <button 
                  className={styles.backButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipCard(model.id);
                  }}
                >
                  <FaAngleLeft /> {t('back')}
                </button>
                
                <div className={styles.watchInfo}>
                  <h3 className={styles.watchName}>{model.name}</h3>
                  
                  <div className={styles.watchFeatures}>
                    {model.features.map((feature, i) => (
                      <span key={i} className={styles.featureTag}>{feature}</span>
                    ))}
                  </div>
                  
                  <div className={styles.watchSpecs}>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>{t('material')}:</span>
                      <span className={styles.specValue}>{model.material}</span>
                    </div>
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>{t('dial')}:</span>
                      <span className={styles.specValue}>{model.dial}</span>
                    </div>
                  </div>
                  
                  <p className={styles.watchDescription}>{model.description}</p>
                  
                  <div className={styles.watchPriceContainer}>
                    <p className={styles.watchPrice}>${model.price.toLocaleString()}</p>
                    {model.available ? (
                      <span className={styles.inStock}>{t('inStock')}</span>
                    ) : (
                      <span className={styles.outOfStock}>{t('notifyMe')}</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.buttonContainer}>
                  {model.available ? (
                    <button 
                      className={styles.buyButton}
                      onClick={(e) => handleAddToCart(e, model)}
                    >
                      {t('addToCart')}
                    </button>
                  ) : (
                    <button 
                      className={styles.buyButton}
                      onClick={(e) => handleNotifyClick(e, model)}
                    >
                      {t('notifyMe')}
                    </button>
                  )}
                  
                  <div className={styles.secondaryActions}>
                    <button 
                      className={styles.actionButton}
                      onClick={(e) => handleViewDetails(e, model)}
                    >
                      <FaInfoCircle />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Separated modal component */}
      <NotifyMeModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedModel={selectedModel}
        t={t}
        theme={theme}
      />
    </section>
  );
};

export default FlippableWatches;
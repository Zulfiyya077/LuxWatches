
import React, { useState, useContext, useEffect } from "react";
import { useCoupon } from "../../context/CouponContext";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CouponInput.module.css";

const CouponInput = () => {
  const [couponCode, setCouponCode] = useState("");
  const { applyCoupon, removeCoupon, appliedCoupon, loading, couponError } = useCoupon();
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
 
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsValidating(true);
    } else {
   
      const timeout = setTimeout(() => {
        setIsValidating(false);
      }, 300); 
      
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      await applyCoupon(couponCode.trim());
    }
  };

  const getDiscountText = () => {
    if (!appliedCoupon) return "";
    
    const { discount_type, discount_value } = appliedCoupon;
    
    if (discount_type === 'percentage') {
      return `${discount_value}% ${t("coupon.discount")}`;
    } else if (discount_type === 'fixed') {
      return `${discount_value} AZN ${t("coupon.discount")}`;
    }
    
    return "";
  };


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100,
        duration: 0.5 
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const formItemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className={`${styles.couponContainer} ${theme === "dark" ? styles.darkMode : ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 
        className={styles.couponHeader}
        variants={formItemVariants}
      >
        {t("coupon.title")}
      </motion.h3>
      
      <AnimatePresence mode="wait">
        {appliedCoupon ? (
          // Əgər kupon tətbiq edilmişsə
          <motion.div 
            className={styles.appliedCoupon}
            key="success"
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className={styles.couponSuccess}>
              {t("coupon.applied")} <span className={styles.couponCodeText}>{appliedCoupon.code}</span> 
              ({getDiscountText()})
            </div>
            <motion.button 
              onClick={removeCoupon} 
              className={styles.removeCouponBtn}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("coupon.remove")}
            </motion.button>
          </motion.div>
        ) : (
          // Əgər kupon tətbiq edilməmişsə
          <motion.form 
            onSubmit={handleApplyCoupon} 
            className={styles.couponForm}
            key="form"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={t("coupon.placeholder")}
              className={styles.couponInput}
              variants={formItemVariants}
              disabled={loading}
            />
            <motion.button
              type="submit"
              className={styles.couponButton}
              disabled={loading || !couponCode.trim()}
              variants={formItemVariants}
              whileHover={!loading && couponCode.trim() ? { scale: 1.05 } : {}}
              whileTap={!loading && couponCode.trim() ? { scale: 0.95 } : {}}
            >
              {isValidating ? t("coupon.checking") : t("coupon.apply")}
              {isValidating && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.2, 1, 0.2],
                    transition: { repeat: Infinity, duration: 1.5 }
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  ...
                </motion.span>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {couponError && !appliedCoupon && (
          <motion.p 
            className={styles.couponError}
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {couponError}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CouponInput;
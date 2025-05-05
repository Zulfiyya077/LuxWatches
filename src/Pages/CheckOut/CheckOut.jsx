import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { useTranslation } from "react-i18next";
import { useCoupon } from "../../context/CouponContext";
import CouponInput from "../../components/CouponInput/CouponInput";
import { motion } from "framer-motion"; 
import styles from "./CheckOut.module.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const { t } = useTranslation();
  const { isEmpty, items, emptyCart, cartTotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { calculateSubtotal, calculateDiscount, getFinalPrice, appliedCoupon } = useCoupon();

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const finalTotal = getFinalPrice();

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, "");
    
    // Limit to 16 digits
    if (value.length <= 16) {
      // Add spaces after every 4 digits
      value = value.replace(/(.{4})/g, "$1 ").trim();
      setCardNumber(value);
    }
  };

  // Format expiry date as MM/YY
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length <= 4) {
      if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
      setExpiryDate(value);
    }
  };

  // Limit CVV to 3-4 digits
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Simulate payment processing
      setTimeout(() => {
        emptyCart();
        navigate("/thankyou");
      }, 1500);
    } catch (error) {
      console.error(t("checkout.paymentErrorLog"), error);
      setLoading(false);
    }
  };

  if (isEmpty) {
    return (
      <motion.div 
        className={styles.emptyCartMessage}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h2>{t("checkout.emptyCart")}</h2>
        <p>{t("checkout.addItemsFirst")}</p>
        <motion.button
          onClick={() => navigate("/products")}
          className={styles.shopButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("checkout.returnToProducts")}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={styles.form}
      initial="hidden"
      animate="visible"
      variants={staggerItems}
    >
      <motion.div 
        className={styles.orderSummary}
        variants={fadeInUp}
      >
        <h2>{t("checkout.orderSummary")}</h2>
        
        {/* Coupon input component */}
        <CouponInput />
        
        <motion.div 
          className={styles.summaryDetails}
          variants={staggerItems}
        >
          <motion.div 
            className={styles.summaryRow}
            variants={fadeInUp}
          >
            <span>{t("checkout.subtotal")}:</span>
            <span>{subtotal.toFixed(2)} {t("common.currency")}</span>
          </motion.div>
          
          {/* Show discount if coupon is applied */}
          {discount > 0 && (
            <motion.div 
              className={styles.summaryRow}
              variants={fadeInUp}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4 }}
            >
              <span>{t("checkout.discount")} 
                {appliedCoupon && <span className={styles.couponCode}>({appliedCoupon.code})</span>}:
              </span>
              <span className={styles.discountAmount}>
                -{discount.toFixed(2)} {t("common.currency")}
              </span>
            </motion.div>
          )}
          
          <motion.div 
            className={`${styles.summaryRow} ${styles.totalRow}`}
            variants={fadeInUp}
          >
            <span>{t("checkout.total")}:</span>
            <span className={styles.finalAmount}>{finalTotal.toFixed(2)} {t("common.currency")}</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Card information */}
      <motion.div 
        className={styles.cardContainer}
        variants={fadeInUp}
      >
        {/* Card holder name field */}
     

        <motion.div 
          className={styles.card}
          variants={fadeInUp}
        >
          <div className={styles.cardInner}>
            <div className={styles.cardFront}>
              <div className={styles.cardChip}></div>
              <div className={styles.cardLogo}>
                <span className={styles.bankName}>{t("checkout.premiumBank")}</span>
              </div>
              <div className={styles.cardNumber}>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className={styles.cardNumberInput}
                />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardExpiry}>
                
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    className={styles.expiryInput}
                  />
                </div>
                <div className={styles.cardCvv}>
               
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={handleCvvChange}
                    className={styles.cvvInput}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className={styles.cardActions}
        variants={fadeInUp}
      >
        <motion.button
          type="submit"
          className={styles.payButton}
          disabled={loading || isEmpty}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? t("checkout.processing") : t("checkout.pay")}
          {loading && (
            <span className={styles.loadingDots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

const CheckoutPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.checkoutContainer}>
      <CheckoutForm />
    </div>
  );
};

export default CheckoutPage;
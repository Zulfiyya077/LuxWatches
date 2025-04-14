import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { useTranslation } from "react-i18next";
import { useCoupon } from "../../context/CouponContext";
import CouponInput from "../../components/CouponInput/CouponInput";
import { motion } from "framer-motion"; // Animasiyalar üçün əlavə edildi
import styles from "./Checkout.module.css";

const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#f8f6ea",  // Lighter color for better visibility
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#bdc3c7",  // Lighter placeholder color
      },
      iconColor: "#d4af37",  // Gold color for icons
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

// Enhanced animation variants
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

// New scale animation for interactive elements
const scaleOnHover = {
  whileHover: { scale: 1.05, transition: { duration: 0.3 } },
  whileTap: { scale: 0.95 }
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [cardError, setCardError] = useState(null);
  const { t } = useTranslation();
  const { isEmpty, items, emptyCart, cartTotal } = useCart();
  const navigate = useNavigate();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  // Add coupon functionality
  const { calculateSubtotal, calculateDiscount, getFinalPrice, appliedCoupon } = useCoupon();

  // Aralıq cəmi hesablayırıq - cart items əsasında
  const subtotal = calculateSubtotal();
  
  // Endirim məbləğini hesablayırıq
  const discount = calculateDiscount();
  
  // Son qiyməti hesablayırıq
  const finalTotal = getFinalPrice();

  const handleCardChange = (event) => {
    // Kart məlumatları yoxlanışı
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe yüklənməyibsə
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Real tətbiqdə burada Stripe API ilə ödəniş əməliyyatı
      // Sadələşdirmə məqsədilə, simulyasiya edirik:
      setTimeout(() => {
        emptyCart();
        navigate("/thankyou");
      }, 1500);
    } catch (error) {
      console.error("Ödəniş zamanı xəta:", error);
      setCardError(t("checkout.paymentError"));
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
            <span>{subtotal.toFixed(2)} AZN</span>
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
                -{discount.toFixed(2)} AZN
              </span>
            </motion.div>
          )}
          
          <motion.div 
            className={`${styles.summaryRow} ${styles.totalRow}`}
            variants={fadeInUp}
          >
            <span>{t("checkout.total")}:</span>
            <span className={styles.finalAmount}>{finalTotal.toFixed(2)} AZN</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className={styles.card}
        variants={fadeInUp}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardFront}>
            <div className={styles.cardChip}></div>
            <div className={styles.cardLogo}>
              <span className={styles.bankName}>Premium Bank</span>
            </div>
            <div className={styles.cardNumber}>
              <CardElement 
                options={CARD_ELEMENT_OPTIONS}
                onChange={handleCardChange}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {cardError && (
        <motion.div 
          className={styles.error}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {cardError}
        </motion.div>
      )}

      <motion.div 
        className={styles.cardActions}
        variants={fadeInUp}
      >
        <motion.button
          type="submit"
          className={styles.payButton}
          disabled={loading || isEmpty || !stripe}
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
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
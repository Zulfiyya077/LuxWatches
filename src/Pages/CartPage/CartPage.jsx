import React, { useEffect, useState, useContext, useRef } from "react";
import { useCart } from "react-use-cart";
import styles from "./CartPage.module.css";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import supabase from "../../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { useCoupon } from "../../context/CouponContext";
import CouponInput from "../../components/CouponInput/CouponInput";

const CartPage = () => {
  const { theme } = useContext(ThemeContext);
  const { 
    items, 
    updateItemQuantity, 
    removeItem, 
    isEmpty,
    cartTotal, 
    setItems,
    totalItems
  } = useCart();
  
  const [forceUpdate, setForceUpdate] = useState(0);
  const [cartItems, setCartItems] = useState(items);
  const { t } = useTranslation();
  const { calculateSubtotal, calculateDiscount, getFinalPrice, appliedCoupon } = useCoupon();
  
  // Track total items and cart total with refs
  const prevTotalItemsRef = useRef(totalItems);
  const prevCartTotalRef = useRef(cartTotal);
  // State for displaying total price
  const [displayTotal, setDisplayTotal] = useState(getFinalPrice());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleForceUpdate = () => {
    setForceUpdate(prev => prev + 1);
  };

  // Həll 1: Səbət dəyişikliklərində dərhal hesablama
  useEffect(() => {
    setCartItems(items);
    const newTotal = getFinalPrice();
    setDisplayTotal(newTotal);
    handleForceUpdate();
    
    prevTotalItemsRef.current = totalItems;
    prevCartTotalRef.current = cartTotal;
  }, [items, totalItems, cartTotal, getFinalPrice]);

  const updateCartInSupabase = async () => {
    const { data: user, error } = await supabase.auth.getUser(); 

    if (error) {
      console.error("Error getting user:", error);
      toast.error(t("errors.userFetch"));
      return;
    }

    const userId = user?.id; 

    if (!userId) {
      console.log("User not logged in.");
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('carts')
        .upsert({
          user_id: userId,
          items: cartItems, 
          updated_at: new Date(),
        });

      if (updateError) {
        throw updateError;
      } else {
        console.log("Cart updated successfully");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(t("errors.cartUpdate"));
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      updateCartInSupabase();
    }
  }, [cartItems]); 

  // Həll 2: Qiymətləri dərhal hesablama funcksiyası
  const recalculateCart = () => {
    const newTotal = getFinalPrice();
    setDisplayTotal(newTotal);
    handleForceUpdate();
  };

  // Həll 3: setTimeout-ları ləğv edib dərhal yeniləmə
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      toast.info(t("cart.itemRemoved"));
      removeItem(itemId);
    } else {
      updateItemQuantity(itemId, newQuantity);
      // Dərhal yeniləmə (setTimeout olmadan)
      recalculateCart();
      toast.success(t("cart.quantityUpdated"));
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
    // Dərhal yeniləmə (setTimeout olmadan)
    recalculateCart();
    toast.info(t("cart.itemRemoved"));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.5 }
    }
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  };

  // Qiymət hesablamalarının hər rendering zamanı yenilənməsini təmin etmək
  const { subtotal, discount, finalTotal } = {
    subtotal: calculateSubtotal(),
    discount: calculateDiscount(),
    finalTotal: displayTotal
  };

  return (
    <motion.div 
      key={`cart-page-${forceUpdate}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`${styles.cartPage} ${theme === "dark" ? styles.darkMode : ""}`}
    >
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      <motion.h1 
        className={styles.basket}
        variants={itemVariants}
      >
        {t("cart.title")}
      </motion.h1>
      
      {isEmpty ? (
        <motion.div 
          variants={itemVariants}
          className={styles.emptyCart}
        >
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2 
            }}
          >
            {t("cart.empty")}
          </motion.p>
          <Link to="/products">
            <motion.button
              className={styles.shopButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("cart.shop")}
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className={styles.cartItemsContainer}>
            {items.map((item) => (
              <motion.div 
                key={`${item.id}-${item.quantity}-${forceUpdate}`}
                className={styles.cartItem}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                exit="exit"
                layout
              >
                <div className={styles.imageContainer}>
                  <img src={item.image} alt={item.name} className={styles.cartItemImage} />
                </div>
                <div className={styles.cartItemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.priceTag}>
                    {item.discounted ? (
                      <span className={styles.discountedPrice}>{item.discountedPrice} AZN</span>
                    ) : (
                      <span>{item.price} AZN</span>
                    )}
                  </p>
                  <div className={styles.quantityControl}>
                    <motion.button 
                      className={styles.quantityBtn}
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </motion.button>
                    <motion.span
                      key={`${item.id}-${item.quantity}-${forceUpdate}`}
                      initial={{ scale: 1.5, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.quantity}
                    </motion.span>
                    <motion.button 
                      className={styles.quantityBtn}
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                  </div>
                  <motion.button 
                    className={styles.removeBtn} 
                    onClick={() => handleRemoveItem(item.id)}
                    variants={shakeVariants}
                    whileHover="shake"
                  >
                    {t("cart.remove")}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        
          <motion.div
            variants={itemVariants}
            className={styles.couponSection}
          >
            <CouponInput />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className={styles.orderSummary}
            key={`summary-${forceUpdate}`}
          >
            <h3 className={styles.summaryTitle}>{t("cart.orderSummary")}</h3>
            
            <div className={styles.summaryRow}>
              <span>{t("cart.subtotal")}:</span>
              <span>{subtotal.toFixed(2)} AZN</span>
            </div>
            
            {discount > 0 && (
              <motion.div 
                className={styles.summaryRow}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                key={`discount-${forceUpdate}`}
              >
                <span>
                  {t("cart.discount")} 
                  {appliedCoupon && <span className={styles.couponCode}>({appliedCoupon.code})</span>}:
                </span>
                <span className={styles.discountAmount}>
                  -{discount.toFixed(2)} AZN
                </span>
              </motion.div>
            )}
            
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>{t("cart.total")}:</span>
              <motion.span 
                className={styles.totalAmount}
                key={`total-${forceUpdate}`}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {finalTotal.toFixed(2)} AZN
              </motion.span>
            </div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className={styles.checkoutBtnContainer}
          >
            <Link to="/checkout" className={styles.checkoutLink}>
              <motion.button 
                className={styles.checkoutButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ boxShadow: "0 6px 15px rgba(52, 152, 219, 0.3)" }}
                animate={{ 
                  boxShadow: ["0 6px 15px rgba(52, 152, 219, 0.3)", "0 6px 20px rgba(52, 152, 219, 0.5)", "0 6px 15px rgba(52, 152, 219, 0.3)"],
                  transition: {
                    duration: 2,
                    repeat: Infinity
                  }
                }}
              >
                {t("cart.checkout")}
                <span className={styles.btnShine}></span>
              </motion.button>
            </Link>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default CartPage;
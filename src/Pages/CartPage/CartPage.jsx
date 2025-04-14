import React, { useEffect, useState, useContext } from "react";
import { useCart } from "react-use-cart";
import styles from "./CartPage.module.css";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import supabase from "../../supabaseClient";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const CartPage = () => {
  const { theme } = useContext(ThemeContext);
  const { items, updateItemQuantity, removeItem } = useCart();
  const [cartItems, setCartItems] = useState(items);
  const { t } = useTranslation();

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.discounted ? item.discountedPrice : item.price;
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

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
        // Uğurlu yeniləmələrdə hər dəfə bildiriş göstərməyə ehtiyac yoxdur
        console.log("Cart updated successfully");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(t("errors.cartUpdate"));
    }
  };

  useEffect(() => {
    setCartItems(items);
    if (items.length > 0) {
      updateCartInSupabase(); 
    }
  }, [items]); 

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      toast.info(t("cart.itemRemoved"));
      removeItem(itemId);
    } else {
      updateItemQuantity(itemId, newQuantity);
      toast.success(t("cart.quantityUpdated"));
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
    toast.info(t("cart.itemRemoved"));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`${styles.cartPage} ${theme === "dark" ? styles.darkMode : ""}`}
    >
      <ToastContainer
        position="top-right"
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
      <h1 className={styles.basket}>{t("cart.title")}</h1>
      
      {items.length === 0 ? (
        <motion.p 
          variants={itemVariants}
          className={styles.emptyCart}
        >
          {t("cart.empty")}
        </motion.p>
      ) : (
        <div className={styles.cartItemsContainer}>
          {items.map((item) => (
            <motion.div 
              key={item.id} 
              className={styles.cartItem}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className={styles.imageContainer}>
                <img src={item.image} alt={item.name} className={styles.cartItemImage} />
              </div>
              <div className={styles.cartItemDetails}>
                <h3>{item.name}</h3>
                <p className={styles.priceTag}>
                  {item.discounted ? (
                    <span className={styles.discountedPrice}>{item.discountedPrice} USD</span>
                  ) : (
                    <span>{item.price} USD</span>
                  )}
                </p>
                <div className={styles.quantityControl}>
                  <button 
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button className={styles.removeBtn} onClick={() => handleRemoveItem(item.id)}>
                  {t("cart.remove")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {items.length > 0 && (
        <>
          <motion.div 
            variants={itemVariants}
            className={styles.total}
          >
            <h3>{t("cart.total")}: <span className={styles.totalAmount}>{calculateTotal()} USD</span></h3>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className={styles.checkoutBtnContainer}
          >
            <Link to="/checkout" className={styles.checkoutLink}>
              <button className={styles.checkoutButton}>
                {t("cart.checkout")}
                <span className={styles.btnShine}></span>
              </button>
            </Link>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default CartPage;
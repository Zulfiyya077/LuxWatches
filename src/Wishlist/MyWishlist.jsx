import React, { useEffect, useState, useContext } from "react";
import { useWishlist } from "react-use-wishlist";
import { useCart } from "react-use-cart";
import styles from "./Wishlist.module.css";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const Wishlist = () => {
  const { items, removeWishlistItem, isWishlistEmpty } = useWishlist();
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = useState(items);
  const { theme } = useContext(ThemeContext);
  const isDarkTheme = theme === 'dark';
  const { t } = useTranslation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  
  useEffect(() => {
    setWishlistItems(items);
  }, [items]);

  const handleRemoveFromWishlist = (id) => {
    removeWishlistItem(id);
  };

  const handleAddToCart = (item) => {
    addItem(item);
  };

  return (
    <div className={`${styles.wishlistContainer} ${isDarkTheme ? styles.darkTheme : styles.lightTheme}`}>
      <h2>{t("wishlist.title")}</h2>
      {isWishlistEmpty ? (
        <p className={styles.emptyMessage}>{t("wishlist.empty")}</p>
      ) : (
        <div className={styles.wishlistGrid}>
          {wishlistItems.map((item, index) => (
            <div 
              key={item.id} 
              className={styles.wishlistItem}
              style={{"--i": index}}
            >
              <div className={styles.imageWrapper}>
                <img 
                  src={item.image || ""} 
                  alt={item.name} 
                  className={styles.productImage} 
                />
              </div>
              <div className={styles.contentWrapper}>
                <h3>{item.name}</h3>
                <p className={styles.price}>{item.price} ₼</p>
                <div className={styles.buttonGroup}>
                  <button 
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCart(item)}
                  >
                    {t("wishlist.addToCart")}
                  </button>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    {t("wishlist.remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
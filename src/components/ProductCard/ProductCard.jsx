import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import styles from "./ProductCard.module.css";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "react-use-wishlist"; 

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { 
    id, 
    name, 
    model, 
    price, 
    discounted, 
    discountedPrice, 
    image, 
    description, 
    rating, 
    availability, 
    new: isNew 
  } = product;

  const { addWishlistItem, removeWishlistItem, inWishlist } = useWishlist();  
  const { t } = useTranslation();
  const { addItem, items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isInWishlist, setIsInWishlist] = useState(inWishlist(id));
  const isInCart = items.some((item) => item.id === id);

  // Qiymətləri yoxlamaq və əgər null və ya undefined olarsa, onları 0 ilə əvəz etmək
  const validPrice = price != null && !isNaN(price) ? parseFloat(price).toFixed(2) : "0.00";
  const validDiscountedPrice = discountedPrice != null && !isNaN(discountedPrice) ? parseFloat(discountedPrice).toFixed(2) : validPrice;

  // Rating dəyərinin düzgün olub-olmadığını yoxlayaq
  const validRating = rating != null && !isNaN(rating) && rating >= 0 && rating <= 5 ? rating.toFixed(1) : "0.0";

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      alert(t("product.needLoginToWishlist"));
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      removeWishlistItem(id);
    } else {
      addWishlistItem(product);
    }

    setIsInWishlist(!isInWishlist);
  };

  return (
    <div 
      className={`${styles.productCard} ${styles[viewMode]}`} 
      onClick={() => navigate(`/products/${id}`)}
    >
      <div className={styles.imageContainer}>
        <img src={image} alt={name} className={styles.productImage} />

        {isNew && <span className={styles.newBadge}>{t("product.new")}</span>}
        {discounted && (
          <span className={styles.discountBadge}>
            {t("product.discount", { 
              percent: Math.round(((price - discountedPrice) / price) * 100) 
            })}
          </span>
        )}

        <div className={styles.quickActions}>
          <button 
            className={styles.actionButton} 
            title={t("product.viewDetails")} 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${id}`);
            }}
          >
            <Eye size={18} />
          </button>
          <button
            className={`${styles.actionButton} ${isInWishlist ? styles.active : ''}`}
            title={t("product.toggleWishlist")}
            onClick={handleToggleWishlist}
          >
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className={styles.productInfo}>
        <div className={styles.productHeader}>
          <h3 className={styles.productName}>{name}</h3>
          <p className={styles.productModel}>{model}</p>
        </div>

        <div className={styles.productDetails}>
          {viewMode === "list" && (
            <p className={styles.productDescription}>{description}</p>
          )}

          <div className={styles.productMeta}>
            <div className={styles.ratingStars}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${styles.star} ${
                    i < Math.floor(rating) ? styles.filled : rating % 1 >= 0.5 && i === Math.floor(rating) ? styles.half : ""
                  }`}
                />
              ))}
              <span className={styles.ratingValue}>{validRating}</span>
            </div>

            <div className={styles.availability}>
              <span 
                className={`${styles.statusDot} ${
                  availability ? styles.inStock : styles.outOfStock
                }`}
              ></span>
              <span className={styles.statusText}>
                {availability ? t("product.inStock") : t("product.outOfStock")}
              </span>
            </div>
          </div>

          <div className={styles.productFooter}>
            <div className={styles.priceContainer}>
              {discounted ? (
                <>
                  <span className={styles.oldPrice}>{validPrice} ₼</span>
                  <span className={styles.currentPrice}>{validDiscountedPrice} ₼</span>
                </>
              ) : (
                <span className={styles.currentPrice}>{validPrice} ₼</span>
              )}
            </div>

            <button
              className={`${styles.addToCartButton} ${
                !availability ? styles.disabled : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!user) {
                  alert(t("product.needLoginToCart"));
                  navigate("/login");
                  return;
                }
                if (availability) {
                  addItem(product);
                }
              }}
              disabled={!availability}
            >
              <ShoppingCart size={16} />
              <span>
                {isInCart ? t("product.inCart") : t("product.addToCartShort")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { products } from '../data/products';
import styles from './ProductDetails.module.css';
import { Luxury3DClock } from './Luxury3DClock';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is already in wishlist on component mount
  useEffect(() => {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    const initialWishlistCount = wishlistItems.length;
    setWishlistCount(initialWishlistCount);
    
    if (product) {
      const itemExists = wishlistItems.some(item => item.id === product.id);
      setIsInWishlist(itemExists);
    }
  }, [product]);

  if (!product) return <div className={styles.notFound}>Məhsul tapılmadı</div>;

  const handleAddToWishlist = () => {
    try {
      // Get current wishlist from localStorage
      const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
      
      // Check if product is already in wishlist
      const itemExists = wishlistItems.some(item => item.id === product.id);
      
      if (itemExists) {
        // Remove from wishlist if already exists
        const updatedWishlist = wishlistItems.filter(item => item.id !== product.id);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setWishlistCount(updatedWishlist.length);
        setIsInWishlist(false);
        toast.info('Məhsul sevimlilər siyahısından çıxarıldı', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Add to wishlist
        const updatedWishlist = [...wishlistItems, {
          id: product.id,
          name: product.name,
          price: product.discounted ? product.discountedPrice : product.price,
          image: product.image || 'default-product-image.jpg'
        }];
        
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setWishlistCount(updatedWishlist.length);
        setIsInWishlist(true);
        toast.success('Məhsul sevimlilər siyahısına əlavə edildi', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('Xəta baş verdi. Yenidən cəhd edin.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Wishlist error:', error);
    }
  };

  return (
    <div className={styles.productContainer}>
      <ToastContainer />
      
      <div className={styles.productHeader}>
        <h1 className={styles.productTitle}>{product.name}</h1>
        <div className={styles.wishlistContainer}>
          <button 
            className={`${styles.wishlistButton} ${isInWishlist ? styles.inWishlist : ''}`} 
            onClick={handleAddToWishlist}
            aria-label={isInWishlist ? "Sevimlilərdən çıxar" : "Sevimlilərə əlavə et"}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill={isInWishlist ? "red" : "none"} 
              stroke={isInWishlist ? "red" : "currentColor"} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className={styles.wishlistCount}>{wishlistCount}</span>
          </button>
        </div>
      </div>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Məhsul Haqqında</h2>
        <p className={styles.description}>{product.description}</p>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Qiymət Məlumatları</h2>
        {product.discounted ? (
          <div className={styles.pricing}>
            <p className={styles.oldPrice}>Əvvəlki Qiymət: {product.price} AZN</p>
            <p className={styles.newPrice}>Endirimli Qiymət: {product.discountedPrice} AZN</p>
            <p className={styles.discount}>
              Endirim: {Math.round((1 - product.discountedPrice / product.price) * 100)}%
            </p>
          </div>
        ) : (
          <p className={styles.price}>Qiymət: {product.price} AZN</p>
        )}
      </section>
      
      {product.details && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Texniki Göstəricilər</h2>
          <ul className={styles.detailsList}>
            {Object.entries(product.details).map(([key, value]) => (
              <li key={key} className={styles.detailItem}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
              </li>
            ))}
          </ul>
        </section>
      )}
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Məhsulun Mövcudluğu</h2>
        <p className={`${styles.availability} ${product.availability ? styles.inStock : styles.outOfStock}`}>
          {product.availability ? "Stokda mövcuddur" : "Stokda yoxdur"}
        </p>
      </section>
      
      {product.rating && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reytinq</h2>
          <p className={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <span key={index} className={index < Math.floor(product.rating) ? styles.starFilled : styles.starEmpty}>
                {index < Math.floor(product.rating) ? "★" : "☆"}
              </span>
            ))}
            <span className={styles.ratingText}>{product.rating}/5</span>
          </p>
        </section>
      )}
      
      {/* 3D Clock section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Məhsulu Daha Yaxından Görmək</h2>
        <div className={styles.clockContainer}>
          <Luxury3DClock />
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
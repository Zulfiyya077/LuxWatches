import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ChevronLeft, X, MessageSquare, Send, User } from 'lucide-react';
import styles from './SingleProduct.module.css';
import { useWishlist } from 'react-use-wishlist';
import { useCart } from 'react-use-cart';
import supabase from '../../supabaseClient';
import { useTheme } from '../../context/ThemeContext';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Static reviews state
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Anar Məmmədov',
      rating: 5,
      comment: 'Məhsulun keyfiyyəti gözləntilərimi aşdı. Çatdırılma da çox sürətli oldu. Qızılı rəng seçimim tam istədiyim kimi idi.',
      created_at: '2025-01-15T10:23:45'
    },
    {
      id: 2,
      name: 'Leyla Əliyeva',
      rating: 4,
      comment: 'Qara rəngli model əla görünür, təkcə qablaşdırma biraz zədələnmişdi. Yüksək performans və keyfiyyətli materiallar üçün 4 ulduz.',
      created_at: '2025-02-20T14:17:22'
    },
    {
      id: 3,
      name: 'Orxan Həsənli',
      rating: 5,
      comment: 'Tünd yaşıl rəng seçimim mənzilimə çox yaraşır. İstifadəsi rahat və funksionallığı yüksəkdir. Qətiyyən peşman deyiləm.',
      created_at: '2025-03-05T09:45:30'
    }
  ]);

  const imageContainerRef = useRef(null);
  const popupRef = useRef(null);
  const reviewsRef = useRef(null);

  const { addItem } = useCart();
  const { addWishlistItem, removeWishlistItem, inWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Məhsul tapılmadı:', error.message);
        setProduct(null);
      } else {
        setProduct(data);
        setSelectedImage(data.image);
  
        if (data.video_url) {
          setVideoUrl(data.video_url);
        } else {
          const { data: videoData, error: videoError } = await supabase
            .storage
            .from('product_videos')
            .getPublicUrl(`${data.id}_video.mp4`);
            
          if (!videoError && videoData) {
            setVideoUrl(videoData.publicUrl);
          }
        }
      }

      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowVideoPopup(false);
      }
    };

    if (showVideoPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVideoPopup]);

  const handleImageClick = () => {
    if (videoUrl) {
      setShowVideoPopup(true);
    }
  };

  const closeVideoPopup = () => {
    setShowVideoPopup(false);
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };


  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    
    setReviewSubmitting(true);
 
    const newReviewObj = {
      id: reviews.length + 1,
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: new Date().toISOString()
    };
    

    setReviews(prevReviews => [newReviewObj, ...prevReviews]);

    setNewReview({ name: '', rating: 5, comment: '' });
    setShowReviewForm(false);
    setReviewSubmitting(false);
  };

  const scrollToReviews = () => {
    setShowReviewForm(true);
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) return (
    <div className={`${styles.loading} ${theme === 'dark' ? styles.darkMode : ''}`}>
      Yüklənir...
    </div>
  );
  
  if (!product) return (
    <div className={`${styles.notFound} ${theme === 'dark' ? styles.darkMode : ''}`}>
      Məhsul tapılmadı.
    </div>
  );

  const validPrice = product.price != null && !isNaN(product.price) ? parseFloat(product.price).toFixed(2) : "0.00";
  const validDiscountedPrice = product.discountedPrice != null && !isNaN(product.discountedPrice) ? parseFloat(product.discountedPrice).toFixed(2) : validPrice;

  const avgRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : product.rating != null && !isNaN(product.rating) && product.rating >= 0 && product.rating <= 5 
      ? product.rating.toFixed(1) 
      : "0.0";

  const isProductInWishlist = inWishlist(product.id);

  const handleToggleWishlist = () => {
    if (isProductInWishlist) {
      removeWishlistItem(product.id);
    } else {
      addWishlistItem({
        id: product.id,
        name: product.name,
        price: product.discounted ? product.discountedPrice : product.price,
        image: product.image
      });
    }
  };

  const handleGoBack = () => navigate(-1);
  const renderRatingStars = (rating, interactive = false) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className={styles.ratingStars}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className={`${styles.star} ${
              i < fullStars ? styles.filled : hasHalfStar && i === fullStars ? styles.half : ''
            } ${interactive ? styles.interactive : ''}`}
            onClick={interactive ? () => handleRatingChange(i + 1) : undefined}
          />
        ))}
        {!interactive && <span className={styles.ratingValue}>{rating}</span>}
      </div>
    );
  };

  const getZoomStyle = () => {
    if (!isZooming) return {};
    const scale = 2.5;
    return {
      transform: `scale(${scale})`,
      transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`
    };
  };

  return (
    <div className={`${styles.singleProductContainer} ${theme === 'dark' ? styles.darkMode : ''}`}>
      <button className={styles.backButton} onClick={handleGoBack}>
        <ChevronLeft size={24} />
      </button>

      <div className={styles.productLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.imageGalleryWrapper}>
            <div 
              ref={imageContainerRef}
              className={`${styles.mainImageContainer} ${isZooming ? styles.zooming : ''}`}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleImageClick}
            >
              <img 
                src={selectedImage} 
                alt={product.name} 
                className={styles.mainImage} 
                style={getZoomStyle()}
              />
              {videoUrl && (
                <div className={styles.videoIndicator}>
                  <span>Videonu izləmək üçün klikləyin</span>
                </div>
              )}
              {product.discounted && (
                <span className={styles.discountBadge}>
                  -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
                </span>
              )}
            </div>
          </div>
          <div className={styles.reviewsSection} ref={reviewsRef}>
            <h2 className={styles.reviewsTitle}>
              <MessageSquare size={24} />
              Müştəri Rəyləri
            </h2>
            
            <div className={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewerInfo}>
                      <div className={styles.reviewerAvatar}>
                        <User size={24} />
                      </div>
                      <span className={styles.reviewerName}>{review.name}</span>
                    </div>
                    <div className={styles.reviewRating}>
                      {renderRatingStars(review.rating)}
                    </div>
                  </div>
                  <div className={styles.reviewContent}>
                    <p>{review.comment}</p>
                  </div>
                  <div className={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString('az-AZ')}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.addReviewContainer}>
              {!showReviewForm ? (
                <button 
                  className={styles.addReviewButton}
                  onClick={() => setShowReviewForm(true)}
                >
                  <MessageSquare size={18} />
                  Rəy Yazın
                </button>
              ) : (
                <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
                  <h3>Rəyinizi Bildirin</h3>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Adınız</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newReview.name}
                      onChange={handleReviewChange}
                      required
                      placeholder="Adınızı daxil edin"
                      className={styles.reviewInput}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Reytinq</label>
                    <div className={styles.ratingSelector}>
                      {renderRatingStars(newReview.rating, true)}
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="comment">Rəyiniz</label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={newReview.comment}
                      onChange={handleReviewChange}
                      required
                      placeholder="Məhsul haqqında fikirlərinizi yazın..."
                      className={styles.reviewTextarea}
                      rows={4}
                    />
                  </div>
                  
                  <div className={styles.formActions}>
                    <button 
                      type="button" 
                      className={styles.cancelButton}
                      onClick={() => setShowReviewForm(false)}
                    >
                      Ləğv Et
                    </button>
                    <button 
                      type="submit" 
                      className={styles.submitButton}
                      disabled={reviewSubmitting}
                    >
                      {reviewSubmitting ? 'Göndərilir...' : 'Rəy Göndər'}
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.productInfo}>
            <div className={styles.productHeader}>
              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.productModel}>{product.model}</p>
            </div>

            <div className={styles.productMeta}>
              <div className={styles.ratingContainer}>
                {renderRatingStars(avgRating)}
                <button 
                  className={styles.reviewsButton} 
                  onClick={scrollToReviews}
                >
                  {reviews.length} rəy | Rəy yazın
                </button>
              </div>
              <div className={styles.availability}>
                <span
                  className={`${styles.statusDot} ${
                    product.availability ? styles.inStock : styles.outOfStock
                  }`}
                />
                <span className={styles.statusText}>
                  {product.availability ? 'Stokda var' : 'Stokda yoxdur'}
                </span>
              </div>
            </div>

            <div className={styles.productDescription}>
              <p>{product.description}</p>
            </div>

            <div className={styles.productDetails}>
              <h3>Texniki Xüsusiyyətlər</h3>
              <ul className={styles.specificationsList}>
                {product.details &&
                  Object.entries(product.details).map(([key, value]) => (
                    <li key={key}>
                      <strong>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:{' '}
                      </strong>
                      {value}
                    </li>
                  ))}
              </ul>
            </div>

            <div className={styles.productFooter}>
              <div className={styles.priceContainer}>
                {product.discounted ? (
                  <>
                    <span className={styles.oldPrice}>{validPrice} ₼</span>
                    <span className={styles.currentPrice}>{validDiscountedPrice} ₼</span>
                  </>
                ) : (
                  <span className={styles.currentPrice}>{validPrice} ₼</span>
                )}
              </div>

              <div className={styles.actionButtons}>
                <button
                  className={`${styles.wishlistButton} ${isProductInWishlist ? styles.active : ''}`}
                  onClick={handleToggleWishlist}
                  aria-label={isProductInWishlist ? "Seçilmişlərdən çıxar" : "Seçilmişlərə əlavə et"}
                >
                  <Heart size={24} />
                </button>

                <button
                  className={`${styles.addToCartButton} ${!product.availability ? styles.disabled : ''}`}
                  onClick={() => addItem(product)}
                  disabled={!product.availability}
                >
                  <ShoppingCart size={16} />
                  <span>Səbətə əlavə et</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showVideoPopup && videoUrl && (
        <div className={styles.videoPopupOverlay}>
          <div className={styles.videoPopupContainer} ref={popupRef}>
            <button className={styles.closeButton} onClick={closeVideoPopup} aria-label="Videonu bağla">
              <X size={24} />
            </button>
            <video
              src={videoUrl}
              className={styles.popupVideo}
              controls
              autoPlay
              muted={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
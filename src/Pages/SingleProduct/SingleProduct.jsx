import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronLeft,
  X,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import styles from "./SingleProduct.module.css";
import { useWishlist } from "react-use-wishlist";
import { useCart } from "react-use-cart";
import supabase from "../../supabaseClient";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WristTryOn from "../../components/WristTryOn";

const SingleProduct = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

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
        .from("Products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Məhsul tapılmadı:", error.message);
        setProduct(null);
      } else {
        setProduct(data);
        setSelectedImage(data.image);

        if (data.video_url) {
          setVideoUrl(data.video_url);
        } else {
          const { data: videoData, error: videoError } = await supabase.storage
            .from("product_videos")
            .getPublicUrl(`${data.id}_video.mp4`);

          if (!videoError && videoData) {
            setVideoUrl(videoData.publicUrl);
          }
        }
        
        // Əgər məhsulun review məlumatları varsa, onları parseləyək
        fetchReviews(data.id);
      }

      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  const fetchReviews = async (productId) => {
    setLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from("Products")
        .select("reviews")
        .eq("id", productId)
        .single();
  
      if (error) {
        console.error("Reviews tapılmadı:", error.message);
        setReviews([]);
      } else if (data && data.reviews) {
        // Əgər reviews JSON string kimi saxlanıbsa, parse edirik
        try {
          const parsedReviews = typeof data.reviews === 'string' 
            ? JSON.parse(data.reviews) 
            : (Array.isArray(data.reviews) ? data.reviews : []);
          
          setReviews(parsedReviews || []);
        } catch (parseError) {
          console.error("Reviews parse edilə bilmədi:", parseError);
          setReviews([]);
        }
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Reviews yükləyərkən xəta:", err);
      setReviews([]);
    }
    setLoadingReviews(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowVideoPopup(false);
      }
    };

    if (showVideoPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();

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
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  // Yeni review əlavə etmək funksiyası
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    setReviewSubmitting(true);

    const newReviewObj = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Əvvəlcə cari məlumatları alaq
      const { data: currentProduct, error: fetchError } = await supabase
        .from("Products")
        .select("reviews")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Məlumatları alarkən xəta:", fetchError.message);
        toast.error(t("reviewError"));
        setReviewSubmitting(false);
        return;
      }

      // 2. Yeni review array-i hazırlayaq
      let updatedReviews = [];
      
      // Mövcud reviews massivini emal edək
      if (currentProduct.reviews) {
        // Artıq jsonb tipi olduğu üçün əlavə parse etməyə ehtiyac yoxdur
        updatedReviews = Array.isArray(currentProduct.reviews) 
          ? [newReviewObj, ...currentProduct.reviews]
          : [newReviewObj];
      } else {
        updatedReviews = [newReviewObj];
      }

      // 3. Yeniləmə əməliyyatı - burada sadəcə array ötürürük, JSON.stringify etmirik
      const { error } = await supabase
        .from("Products")
        .update({ reviews: updatedReviews })
        .eq("id", id);

      if (error) {
        console.error("Review əlavə edilə bilmədi:", error.message);
        toast.error(t("reviewError"));
      } else {
        // UI-ı yeniləyirik
        setReviews(updatedReviews);
        setNewReview({ name: "", rating: 5, comment: "" });
        setShowReviewForm(false);
        toast.success(t("reviewSubmitted"));
      }
    } catch (err) {
      console.error("Review göndərilərkən xəta:", err);
      toast.error(t("reviewError"));
    }

    setReviewSubmitting(false);
  };

  const handleAddToCart = () => {
    addItem(product);
    toast.success(t("addedToCart"));
  };

  const scrollToReviews = () => {
    setShowReviewForm(true);
    setTimeout(() => {
      reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading)
    return (
      <div
        className={`${styles.loading} ${isDarkMode ? styles.darkMode : ""}`}
      >
        {t("loading")}
      </div>
    );

  if (!product)
    return (
      <div
        className={`${styles.notFound} ${isDarkMode ? styles.darkMode : ""}`}
      >
        {t("notFound")}
      </div>
    );

  const validPrice =
    product.price != null && !isNaN(product.price)
      ? parseFloat(product.price).toFixed(2)
      : "0.00";
  const validDiscountedPrice =
    product.discountedPrice != null && !isNaN(product.discountedPrice)
      ? parseFloat(product.discountedPrice).toFixed(2)
      : validPrice;

  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : product.rating != null &&
      !isNaN(product.rating) &&
      product.rating >= 0 &&
      product.rating <= 5
    ? product.rating.toFixed(1)
    : "0.0";

  const isProductInWishlist = inWishlist(product.id);

  const handleToggleWishlist = () => {
    if (isProductInWishlist) {
      removeWishlistItem(product.id);
      toast.info(t("removedFromWishlist"));
    } else {
      addWishlistItem({
        id: product.id,
        name: product.name,
        price: product.discounted ? product.discountedPrice : product.price,
        image: product.image,
      });
      toast.success(t("addedToWishlist"));
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
              i < fullStars
                ? styles.filled
                : hasHalfStar && i === fullStars
                ? styles.half
                : ""
            } ${interactive ? styles.interactive : ""}`}
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
      transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
    };
  };

  return (
    <div
      className={`${styles.singleProductContainer} ${isDarkMode ? styles.darkMode : ""}`}
    >
      <button className={styles.backButton} onClick={handleGoBack}>
        <ChevronLeft size={24} />
        <span className={styles.srOnly}>{t("backButton")}</span>
      </button>

      <div className={styles.productLayout}>
        <div className={styles.leftColumn}>
          <div className={styles.imageGalleryWrapper}>
            <div
              ref={imageContainerRef}
              className={`${styles.mainImageContainer} ${
                isZooming ? styles.zooming : ""
              }`}
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
                  <span>{t("watchVideo")}</span>
                </div>
              )}
              {product.discounted && (
                <span className={styles.discountBadge}>
                  {t("discount", {
                    percent: Math.round(
                      ((product.price - product.discountedPrice) /
                        product.price) *
                        100
                    ),
                  })}
                </span>
              )}
            </div>
          </div>

          <div className={styles.reviewsSection} ref={reviewsRef}>
            <h2 className={styles.reviewsTitle}>
              <MessageSquare size={24} />
              {t("reviewsTitle")}
            </h2>

            <div className={styles.reviewsList}>
              {loadingReviews ? (
                <div className={styles.reviewsLoading}>{t("loadingReviews")}</div>
              ) : reviews.length === 0 ? (
                <div className={styles.noReviews}>{t("noReviews")}</div>
              ) : (
                reviews.map((review, index) => (
                  <div key={review.id || `review-${index}`} className={styles.reviewItem}>
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
                  </div>
                ))
              )}
            </div>

            <div className={styles.addReviewContainer}>
              {!showReviewForm ? (
                <button
                  className={styles.addReviewButton}
                  onClick={() => setShowReviewForm(true)}
                >
                  <MessageSquare size={18} />
                  {t("writeReview")}
                </button>
              ) : (
                <form
                  className={styles.reviewForm}
                  onSubmit={handleReviewSubmit}
                >
                  <h3>{t("shareYourReview")}</h3>

                  <div className={styles.formGroup}>
                    <label htmlFor="name">{t("nameLabel")}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newReview.name}
                      onChange={handleReviewChange}
                      required
                      placeholder={t("namePlaceholder")}
                      className={styles.reviewInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>{t("ratingLabel")}</label>
                    <div className={styles.ratingSelector}>
                      {renderRatingStars(newReview.rating, true)}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="comment">{t("commentLabel")}</label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={newReview.comment}
                      onChange={handleReviewChange}
                      required
                      placeholder={t("commentPlaceholder")}
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
                      {t("cancelReview")}
                    </button>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={reviewSubmitting}
                    >
                      {reviewSubmitting
                        ? t("submittingReview")
                        : t("submitReview")}
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
                  {t("reviews", { count: reviews.length })}
                </button>
              </div>
              <div className={styles.availability}>
                <span
                  className={`${styles.statusDot} ${
                    product.availability ? styles.inStock : styles.outOfStock
                  }`}
                />
                <span className={styles.statusText}>
                  {product.availability ? t("inStock") : t("outOfStock")}
                </span>
              </div>
            </div>

            <div className={styles.productDescription}>
              <p>{product.description}</p>
            </div>

            <div className={styles.productDetails}>
              <h3>{t("technicalSpecs")}</h3>
              <ul className={styles.specificationsList}>
                {product.details &&
                  Object.entries(product.details).map(([key, value]) => (
                    <li key={key}>
                      <strong>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        :{" "}
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
                    <span className={styles.currentPrice}>
                      {validDiscountedPrice} ₼
                    </span>
                  </>
                ) : (
                  <span className={styles.currentPrice}>{validPrice} ₼</span>
                )}
              </div>

              <div className={styles.actionButtons}>
                <button
                  className={`${styles.wishlistButton} ${
                    isProductInWishlist ? styles.active : ""
                  }`}
                  onClick={handleToggleWishlist}
                  aria-label={
                    isProductInWishlist
                      ? t("removeFromWishlist")
                      : t("addToWishlist")
                  }
                >
                  <Heart size={24} />
                </button>

                <button
                  className={`${styles.addToCartButton} ${
                    !product.availability ? styles.disabled : ""
                  }`}
                  onClick={handleAddToCart}
                  disabled={!product.availability}
                >
                  <ShoppingCart size={16} />
                  <span>{t("addToCart")}</span>
                </button>

                <button
                  className={styles.tryOnButton}
                  onClick={() => setShowTryOn(!showTryOn)}
                >
                  <span>{showTryOn ? t("hideTryOn") : t("virtualTryOn")}</span>
                </button>
              </div>
              {showTryOn && (
                <div className={styles.tryOnSection}>
                  <WristTryOn
                    watchImage={selectedImage}
                    watchDiameter={product.details?.diameter || 40}
                    productData={product}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showVideoPopup && videoUrl && (
        <div className={styles.videoPopupOverlay}>
          <div className={styles.videoPopupContainer} ref={popupRef}>
            <button
              className={styles.closeButton}
              onClick={closeVideoPopup}
              aria-label="Videonu bağla"
            >
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
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default SingleProduct;
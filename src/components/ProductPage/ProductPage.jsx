import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);


  const mockData = [
    { 
      id: 1, 
      name: "Rolex Submariner", 
      model: "126610LN",
      price: 10000, 
      discounted: true,
      discountedPrice: 8500,
      rating: 4.8,
      availability: true,
      new: true,
      description: "Suya davamlı, premium materiallarla hazırlanmış şanlı saat. Submariner, Rolex'in su altında istifadə üçün yaratdığı ilk saatdır və dərinlik göstəricisi 300 metrə qədərdir.", 
      images: ["/images/rolex1.jpg", "/images/rolex1-2.jpg", "/images/rolex1-3.jpg"],
      features: ["Paslanmaz polad korpus", "Safir kristal şüşə", "Su keçirməzlik: 300m", "Avtomatik hərəkət", "Qara siferblat"],
      specifications: {
        "Diametr": "41mm",
        "Material": "Oystersteel",
        "Şüşə": "Safir kristal",
        "Qol bağı": "Oystersteel",
        "Mexanizm": "Perpetual, mexanik, özü qurulan",
        "Kalibr": "3235",
        "Dəqiqlik": "+2/-2 saniyə/gün",
        "Ehtiyat güc": "70 saat"
      }
    },
    { 
      id: 2, 
      name: "Rolex Day-Date", 
      model: "228239",
      price: 12000, 
      discounted: false,
      rating: 4.9,
      availability: true,
      new: false,
      description: "Prestijli və zərif dizayn. Rolex Day-Date, həftənin günü və tarix göstərən ilk saatdır və əsasən qızıl və platindən hazırlanır.", 
      images: ["/images/rolex2.jpg", "/images/rolex2-2.jpg", "/images/rolex2-3.jpg"],
      features: ["18k ağ qızıl korpus", "Safir kristal şüşə", "Su keçirməzlik: 100m", "Avtomatik hərəkət", "Gümüşü siferblat"],
      specifications: {
        "Diametr": "40mm",
        "Material": "18k ağ qızıl",
        "Şüşə": "Safir kristal",
        "Qol bağı": "President, 18k ağ qızıl",
        "Mexanizm": "Perpetual, mexanik, özü qurulan",
        "Kalibr": "3255",
        "Dəqiqlik": "+2/-2 saniyə/gün",
        "Ehtiyat güc": "70 saat"
      }
    },
    { 
      id: 3, 
      name: "Rolex GMT-Master II", 
      model: "126710BLRO",
      price: 15000, 
      discounted: true,
      discountedPrice: 13500,
      rating: 4.7,
      availability: false,
      new: false,
      description: "Aviasiya üçün hazırlanmış mükəmməl saat. Rolex GMT-Master II, iki saat qurşağını eyni anda izləmə imkanı təqdim edir.", 
      images: ["/images/rolex3.jpg", "/images/rolex3-2.jpg", "/images/rolex3-3.jpg"],
      features: ["Paslanmaz polad korpus", "Safir kristal şüşə", "Su keçirməzlik: 100m", "Avtomatik hərəkət", "İkinci saat qurşağı funksiyası"],
      specifications: {
        "Diametr": "40mm",
        "Material": "Oystersteel",
        "Şüşə": "Safir kristal",
        "Qol bağı": "Jubilee, Oystersteel",
        "Mexanizm": "Perpetual, mexanik, özü qurulan",
        "Kalibr": "3285",
        "Dəqiqlik": "+2/-2 saniyə/gün",
        "Ehtiyat güc": "70 saat"
      }
    },
   
  ];

  useEffect(() => {
    setLoading(true);
   
    const productData = mockData.find((item) => item.id === parseInt(id));
    
    if (productData) {
      setProduct(productData);
      
  
      const similar = mockData
        .filter(item => item.id !== parseInt(id))
        .slice(0, 3); 
      
      setRelatedProducts(similar);
      setSelectedImage(0);
    }
    
    setLoading(false);
  }, [id]);

  const handlePrevProduct = () => {
    const currentIndex = mockData.findIndex(item => item.id === parseInt(id));
    const prevIndex = (currentIndex - 1 + mockData.length) % mockData.length;
    navigate(`/products/${mockData[prevIndex].id}`);
  };

  const handleNextProduct = () => {
    const currentIndex = mockData.findIndex(item => item.id === parseInt(id));
    const nextIndex = (currentIndex + 1) % mockData.length;
    navigate(`/products/${mockData[nextIndex].id}`);
  };

  const handleAddToCart = () => {
    alert(`${product.name} səbətə əlavə edildi! Miqdar: ${quantity}`);
   
  };

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className={styles.ratingStars}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={`${styles.star} ${
              i < fullStars ? styles.filled : (hasHalfStar && i === fullStars) ? styles.half : ''
            }`}
          />
        ))}
        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>Məhsul yüklənir...</p>
    </div>
  );

  if (!product) return (
    <div className={styles.notFound}>
      <h2>Məhsul tapılmadı</h2>
      <Link to="/" className={styles.backLink}>Ana səhifəyə qayıt</Link>
    </div>
  );

  return (
    <div className={styles.productPage}>
      <div className={styles.navigation}>
        <Link to="/" className={styles.breadcrumb}>Ana səhifə</Link> / 
        <Link to="/products" className={styles.breadcrumb}>Məhsullar</Link> / 
        <span className={styles.currentPage}>{product.name}</span>
      </div>
      
      <div className={styles.productContent}>
        <div className={styles.productGallery}>
          <div className={styles.mainImage}>
            <img src={product.images[selectedImage]} alt={product.name} />
            
            {product.new && <span className={styles.newBadge}>Yeni</span>}
            {product.discounted && <span className={styles.discountBadge}>Endirim</span>}
          </div>
          
          <div className={styles.thumbnails}>
            {product.images.map((img, index) => (
              <div 
                key={index} 
                className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} />
              </div>
            ))}
          </div>
          
          <div className={styles.productNavigation}>
            <button onClick={handlePrevProduct} className={styles.navButton}>
              <ArrowLeft size={20} />
              <span>Əvvəlki</span>
            </button>
            <button onClick={handleNextProduct} className={styles.navButton}>
              <span>Sonrakı</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        <div className={styles.productDetails}>
          <div className={styles.productHeader}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productModel}>Model: {product.model}</p>
            
            <div className={styles.productMeta}>
              {renderRatingStars(product.rating)}
              
              <div className={styles.availability}>
                <span className={`${styles.statusDot} ${product.availability ? styles.inStock : styles.outOfStock}`}></span>
                <span className={styles.statusText}>
                  {product.availability ? 'Mövcuddur' : 'Stokda yoxdur'}
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.priceContainer}>
            {product.discounted ? (
              <>
                <span className={styles.oldPrice}>{product.price} ₼</span>
                <span className={styles.currentPrice}>{product.discountedPrice} ₼</span>
                <span className={styles.discount}>
                  {Math.round((1 - product.discountedPrice / product.price) * 100)}% endirim
                </span>
              </>
            ) : (
              <span className={styles.currentPrice}>{product.price} ₼</span>
            )}
          </div>
          
          <p className={styles.productDescription}>{product.description}</p>
          
          <div className={styles.features}>
            <h3>Xüsusiyyətlər</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className={styles.actionSection}>
            <div className={styles.quantityControl}>
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >-</button>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
            </div>
            
            <div className={styles.productActions}>
              <button 
                className={styles.addToCartButton}
                onClick={handleAddToCart}
                disabled={!product.availability}
              >
                <ShoppingCart size={20} />
                <span>Səbətə əlavə et</span>
              </button>
              
              <button className={styles.wishlistButton}>
                <Heart size={20} />
              </button>
              
              <button className={styles.shareButton}>
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.productTabs}>
        <div className={styles.tabsHeader}>
          <button className={`${styles.tabButton} ${styles.active}`}>Ətraflı</button>
          <button className={styles.tabButton}>Xüsusiyyətlər</button>
          <button className={styles.tabButton}>Rəylər</button>
        </div>
        
        <div className={styles.tabContent}>
          <div className={styles.specifications}>
            <h3>Texniki xüsusiyyətlər</h3>
            <table>
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className={styles.relatedProducts}>
          <h2>Oxşar məhsullar</h2>
          <div className={styles.productsGrid}>
            {relatedProducts.map(item => (
              <div key={item.id} className={styles.relatedProduct}>
                <Link to={`/products/${item.id}`} className={styles.relatedProductLink}>
                  <img src={item.images[0]} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p className={styles.relatedProductPrice}>
                    {item.discounted ? item.discountedPrice : item.price} ₼
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
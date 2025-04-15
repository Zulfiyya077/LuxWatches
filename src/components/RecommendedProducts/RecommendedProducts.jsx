
import React, { useEffect, useState, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import styles from "./RecommendedProducts.module.css";
import supabase from "../../supabaseClient";

const RecommendedProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .limit(8)
        .order("id", { ascending: false });
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setProducts(data);
      }
    };
    fetchRecommended();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);


  useEffect(() => {
   
    cardRefs.current.forEach(card => {
      if (card) {
       
        const handleMouseMove = (e) => {
          if (window.innerWidth >= 1024) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 20;
            const angleX = (centerY - y) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
          }
        };
        
        const handleMouseLeave = () => {
          if (window.innerWidth >= 1024) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
          }
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    });
  }, [products]); 
  const getThemedClass = (baseClass) => {
    return theme === "dark" ? `${styles[baseClass]} ${styles[`${baseClass}Dark`]}` : styles[baseClass];
  };

  if (cardRefs.current.length !== products.length) {
    cardRefs.current = Array(products.length).fill().map((_, i) => cardRefs.current[i] || null);
  }
  
  return (
    <div 
      ref={sectionRef}
      className={`${getThemedClass('recommendedSection')} ${isVisible ? styles.visible : ''}`}
    >
      <h2 className={getThemedClass('title')}>
        {t("thankYou.recommendedTitle", "Tövsiyə olunan məhsullar")}
      </h2>
      <div className={styles.grid}>
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={getThemedClass('card')}
            onClick={() => navigate(`/products/${product.id}`)}
            ref={el => cardRefs.current[index] = el}
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className={styles.cardInner}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.image}
                loading="lazy"
              />
              <h3 className={styles.name}>{product.name}</h3>
              <p className={styles.price}>${product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
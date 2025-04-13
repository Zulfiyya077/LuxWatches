// components/RecommendedProducts.js
import React, { useEffect, useState, useContext } from "react";
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

  useEffect(() => {
    const fetchRecommended = async () => {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .limit(5)
        .order("id", { ascending: false }); // Son əlavə olunan 4 məhsul

      if (error) {
        console.error("Supabase Error:", error);
      } else {
        setProducts(data);
      }
    };

    fetchRecommended();
  }, []);

  const getThemedClass = (base) => {
    return theme === "dark" ? `${base} ${base}Dark` : base;
  };

  return (
    <div className={getThemedClass(styles.recommendedSection)}>
      <h2 className={getThemedClass(styles.title)}>
        {t("thankYou.recommendedTitle", "Tövsiyə olunan məhsullar")}
      </h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <div 
            key={product.id} 
            className={getThemedClass(styles.card)}
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
            />
            <h3 className={styles.name}>{product.name}</h3>
            <p className={styles.price}>${product.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;

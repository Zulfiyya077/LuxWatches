import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Products.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductSort from "../../components/ProductSort/ProductSort";
import { Search, Filter, ChevronDown } from "lucide-react";
import supabase from "../../supabaseClient";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext"; 

const Products = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("price_asc");
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [5000, 500000],
    onlyAvailable: false,
    onlyNew: false,
    onlyDiscounted: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Products")
          .select("*");

        if (error) {
          throw error;
        }

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(t("Failed to load products. Please try again later.")); 
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleFilterChange = (filter, value) => {
    setFilters({
      ...filters,
      [filter]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilters = () => {
    setFilterOpen(!filterOpen);
  };

  const applyFilters = (products) => {
    return products.filter((product) => {
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      if (filters.onlyAvailable && !product.availability) {
        return false;
      }

      if (filters.onlyNew && !product.new) {
        return false;
      }

      if (filters.onlyDiscounted && !product.discounted) {
        return false;
      }

      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  const sortProducts = (products) => {
    switch (sortOption) {
      case "price_asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "name_asc":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      case "discounted":
        return [...products].sort(
          (a, b) => (b.discounted ? 1 : 0) - (a.discounted ? 1 : 0)
        );
      case "new":
        return [...products].sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
      case "rating":
        return [...products].sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredProducts = applyFilters(products);
  const sortedProducts = sortProducts(filteredProducts);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const themeStyles = {
    container: theme === 'dark' ? styles.darkContainer : styles.lightContainer,
    text: theme === 'dark' ? styles.darkText : styles.lightText,
    button: theme === 'dark' ? styles.darkButton : styles.lightButton,
    input: theme === 'dark' ? styles.darkInput : styles.lightInput,
    card: theme === 'dark' ? styles.darkCard : styles.lightCard,
  };

  return (
    <div className={`${styles.productsContainer} ${themeStyles.container}`}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle1} ${themeStyles.text}`}>{t('Rolex Kolleksiyası')}</h1>
          <p className={`${styles.heroSubtitle1} ${themeStyles.text}`}>{t('Lüks və dəqiqliyin mükəmməl birləşməsi')}</p>
        </div>
      </div>

      <div className={styles.breadcrumbs}>
        <Link to="/" className={`${styles.breadcrumbLink} ${themeStyles.text}`}>
          {t('Ana Səhifə')}
        </Link>
        <span className={`${styles.breadcrumbSeparator} ${themeStyles.text}`}>/</span>
        <span className={`${styles.breadcrumbCurrent} ${themeStyles.text}`}>{t('Məhsullar')}</span>
      </div>

      <div className={styles.productsWrapper}>
        <div className={`${styles.filterSidebar} ${themeStyles.card}`} data-open={filterOpen}>
          <div className={styles.filterHeader}>
            <h3 className={themeStyles.text}>{t('Filtrlər')}</h3>
            <button className={`${styles.closeFilter} ${themeStyles.button}`} onClick={toggleFilters}>
              ×
            </button>
          </div>

          <div className={styles.filterSection}>
            <h4 className={`${styles.filterTitle} ${themeStyles.text}`}>{t('Qiymət Aralığı')}</h4>
            <div className={styles.priceSliderContainer}>
              <input
                type="range"
                min="5000"
                max="100000"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  handleFilterChange("priceRange", [
                    parseInt(e.target.value),
                    filters.priceRange[1],
                  ])
                }
                className={styles.priceSlider}
                style={{
                  WebkitAppearance: "none",
                  appearance: "none",
                  height: "8px",
                  borderRadius: "5px",
                  background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((filters.priceRange[0] - 5000) / (100000 - 5000)) * 100}%,rgb(68, 18, 1) ${((filters.priceRange[0] - 5000) / (100000 - 5000)) * 100}%, #014421 100%)`,
                  outline: "none",
                }}
              />
              <input
                type="range"
                min="5000"
                max="100000"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange("priceRange", [
                    filters.priceRange[0],
                    parseInt(e.target.value),
                  ])
                }
                className={styles.priceSlider}  style={{
                  WebkitAppearance: "none",
                  appearance: "none",
                  height: "8px",
                  borderRadius: "5px",
                  background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${((filters.priceRange[0] - 5000) / (100000 - 5000)) * 100}%,rgb(68, 18, 1) ${((filters.priceRange[0] - 5000) / (100000 - 5000)) * 100}%, #014421 100%)`,
                  outline: "none",
                }}
              />
              <div className={styles.priceRange}>
                <span className={themeStyles.text}>{filters.priceRange[0]}$</span>
                <span className={themeStyles.text}>{filters.priceRange[1]}$</span>
              </div>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={`${styles.filterTitle} ${themeStyles.text}`}>{t('Status')}</h4>
            <div className={styles.filterCheckbox}>
              <input
                type="checkbox"
                id="available"
                checked={filters.onlyAvailable}
                onChange={(e) =>
                  handleFilterChange("onlyAvailable", e.target.checked)
                }
              />
              <label htmlFor="available" className={themeStyles.text}>{t('Yalnız mövcud olanlar')}</label>
            </div>

            <div className={styles.filterCheckbox}>
              <input
                type="checkbox"
                id="new"
                checked={filters.onlyNew}
                onChange={(e) =>
                  handleFilterChange("onlyNew", e.target.checked)
                }
              />
              <label htmlFor="new" className={themeStyles.text}>{t('Yeni modellər')}</label>
            </div>

            <div className={styles.filterCheckbox}>
              <input
                type="checkbox"
                id="discounted"
                checked={filters.onlyDiscounted}
                onChange={(e) =>
                  handleFilterChange("onlyDiscounted", e.target.checked)
                }
              />
              <label htmlFor="discounted" className={themeStyles.text}>{t('Endirimdə olanlar')}</label>
            </div>
          </div>

          <button className={`${styles.applyFilters} ${themeStyles.button}`}>{t('Filtrləri tətbiq et')}</button>
        </div>

        <div className={`${styles.productsContent} ${themeStyles.container}`}>
          <div className={styles.productsToolbar}>
            <div className={styles.toolbarLeft}>
              <button
                className={`${styles.filterToggleBtn} ${themeStyles.button}`}
                onClick={toggleFilters}
              >
                <Filter size={18} color={theme === 'dark' ? "#fff" : "#000"} />
                <span>{t('Filtrlər')}</span>
              </button>

              <div className={styles.searchContainer}>
                <Search size={18} className={styles.searchIcon} color={theme === 'dark' ? "#fff" : "#000"} />
                <input
                  type="text"
                  placeholder={t('Axtarış...')}
                  className={`${styles.searchInput} ${themeStyles.input}`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className={styles.toolbarRight}>
              <ProductSort onSortChange={handleSortChange} theme={theme} />

              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewBtn} ${
                    viewMode === "grid" ? styles.active : ""
                  } ${themeStyles.button}`}
                  onClick={() => handleViewModeChange("grid")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? "#fff" : "#000"}>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  className={`${styles.viewBtn} ${
                    viewMode === "list" ? styles.active : ""
                  } ${themeStyles.button}`}
                  onClick={() => handleViewModeChange("list")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? "#fff" : "#000"}>
                    <rect x="3" y="4" width="18" height="2" rx="1" />
                    <rect x="3" y="11" width="18" height="2" rx="1" />
                    <rect x="3" y="18" width="18" height="2" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.resultsInfo}>
            <span className={themeStyles.text}>{sortedProducts.length} {t('məhsul tapıldı')}</span>
          </div>

          {loading ? (
            <div className={`${styles.loadingContainer} ${themeStyles.container}`}>
              <div className={styles.spinner}></div>
              <p className={themeStyles.text}>{t('Məhsullar yüklənir...')}</p>
            </div>
          ) : error ? (
            <div className={`${styles.errorContainer} ${themeStyles.container}`}>
              <p className={themeStyles.text}>{error}</p>
              <button className={themeStyles.button} onClick={() => window.location.reload()}>{t('Yenidən cəhd edin')}</button>
            </div>
          ) : (
            <div className={`${styles.productList} ${styles[viewMode]}`}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    theme={theme}
                  />
                ))
              ) : (
                <div className={`${styles.noResults} ${themeStyles.container}`}>
                  <h3 className={themeStyles.text}>{t('Heç bir məhsul tapılmadı')}</h3>
                  <p className={themeStyles.text}>{t('Zəhmət olmasa axtarış və filtr parametrlərinizi dəyişin.')}</p>
                </div>
              )}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className={styles.pagination}>
              {pageNumbers.map(number => (
                <button 
                  key={number}
                  className={`${styles.pageBtn} ${currentPage === number ? styles.active : ''} ${themeStyles.button}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              ))}
              {currentPage < totalPages && (
                <button 
                  className={`${styles.pageBtn} ${styles.nextBtn} ${themeStyles.button}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {t('Növbəti')} <ChevronDown size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
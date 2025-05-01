import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "react-use-cart";
import styles from "./Navbar.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { FiShoppingCart, FiMenu } from "react-icons/fi";
import { BsMoon, BsSun } from "react-icons/bs";
import { IoHeartOutline, IoClose } from "react-icons/io5";
import ReactCountryFlag from "react-country-flag";
import { useWishlist } from "react-use-wishlist";
import { useUser } from "../UserContext";
import supabase from "../../supabaseClient";

const ADMIN_EMAIL = "mammadli.zulfiyya77@gmail.com";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, logout, user } = useUser();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); 
  const [isMobile, setIsMobile] = useState(false);
  
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  
  const isAdmin = user?.email === ADMIN_EMAIL;
  const isAdminDashboard = location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  // Aktiv səhifəni müəyyən etmək üçün funksiya
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Ekran ölçüsünün dəyişikliyini izləyir
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    
    handleResize(); // İlkin yüklənmədə ekran ölçüsünü təyin edir
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 1000); 
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (isAdminDashboard && !isAdmin && isAuthenticated) {
        navigate('/');
      } else if (isAdminDashboard && !isAuthenticated) {
        navigate('/login');
      }
    }
  }, [isAdminDashboard, isAdmin, isAuthenticated, navigate, authLoading]);

  const getUserDisplayName = () => {
    if (user?.raw_user_meta_data?.full_name) {
      return user.raw_user_meta_data.full_name;
    } else if (user?.email) {
      return user.email.split('@')[0]; 
    }
    return "User";
  };

  const getAvatarLetter = () => {
    const fullName = user?.raw_user_meta_data?.full_name;
    const email = user?.email;

    const nameToUse = fullName && !fullName.includes("@") ? fullName : email;

    return nameToUse ? nameToUse.charAt(0).toUpperCase() : "U";
  };

  const handleLogout = async () => {
    try {
      await logout(); 
      console.log("Logout successful");
      setUserMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Menyunu bağlamaq üçün ayrıca funksiya
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!mobileMenuOpen) return;
      
      // Check if click is outside menu and toggle button
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.mobileMenuToggle}`)
      ) {
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const languages = [
    { code: "az", label: "AZ", flag: "AZ" },
    { code: "en", label: "EN", flag: "US" },
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLangMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scrolling when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  const goToAdminDashboard = () => {
    navigate('/admin');
    setUserMenuOpen(false);
  };

  const isDarkMode = theme === "dark";

  return (
    <>
      <nav className={`${styles.navbar} ${isDarkMode ? styles.dark : styles.light}`}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <img 
              className={styles.logoImg} 
              src="/videos/Screenshot Capture - 2025-04-14 - 02-25-33-Photoroom.png" 
              alt="Luxury Watches Logo" 
            />
          </Link>

          <div className={styles.menuWrapper}>
            <div 
              className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ""}`}
              ref={mobileMenuRef}
            >
              {/* X bağlama düyməsi - hamburger menu açıq olduqda */}
              {mobileMenuOpen && (
                <button className={styles.closeMenuBtn} onClick={closeMobileMenu} aria-label="Close menu">
                  <IoClose size={24} />
                </button>
              )}
              
              {/* Naviqasiya linkləri - aktiv səhifə rəngli göstərilir */}
              <div className={styles.navLinksContainer}>
                <Link 
                  to="/" 
                  className={`${styles.navLink} ${isActive('/') ? styles.activeLink : ''}`} 
                  onClick={closeMobileMenu}
                >
                  {t("home")}
                </Link>
                <Link 
                  to="/products" 
                  className={`${styles.navLink} ${isActive('/products') ? styles.activeLink : ''}`} 
                  onClick={closeMobileMenu}
                >
                  {t("products")}
                </Link>
                <Link 
                  to="/about" 
                  className={`${styles.navLink} ${isActive('/about') ? styles.activeLink : ''}`} 
                  onClick={closeMobileMenu}
                >
                  {t("about")}
                </Link>
                <Link 
                  to="/blog" 
                  className={`${styles.navLink} ${isActive('/blog') ? styles.activeLink : ''}`} 
                  onClick={closeMobileMenu}
                >
                  {t("blog")}
                </Link>
                <Link 
                  to="/contact" 
                  className={`${styles.navLink} ${isActive('/contact') ? styles.activeLink : ''}`} 
                  onClick={closeMobileMenu}
                >
                  {t("contact")}
                </Link>
              </div>
            </div>

            <div className={styles.navActions}>
              {/* Desktop tema və dil seçimi düymələri - mobil olmadıqda */}
              {!isMobile && (
                <div className={styles.desktopControls}>
                  <button 
                    onClick={toggleTheme} 
                    className={styles.themeToggle}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDarkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                  </button>
                  
                  <div
                    className={styles.langDropdown}
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    ref={langMenuRef}
                  >
                    <div className={styles.langSelected}>
                      <ReactCountryFlag
                        countryCode={
                          languages.find((l) => l.code === i18n.language)?.flag || "US"
                        }
                        svg
                      />
                      {languages.find((l) => l.code === i18n.language)?.label || "EN"}
                    </div>
                    {langMenuOpen && (
                      <ul className={styles.langMenu}>
                        {languages.map((lang) => (
                          <li
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                          >
                            <ReactCountryFlag countryCode={lang.flag} svg />
                            {lang.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {isAuthenticated && (!isAdmin || !isAdminDashboard) && (
                <>
                  <Link to="/cart" className={`${styles.cartLink} ${isActive('/cart') ? styles.activeIcon : ''}`}>
                    <div className={styles.cartIconContainer}>
                      <FiShoppingCart size={22} />
                      {totalItems > 0 && (
                        <span className={styles.cartCounter}>{totalItems}</span>
                      )}
                    </div>
                  </Link>

                  <Link to="/favorites" className={`${styles.favLink} ${isActive('/favorites') ? styles.activeIcon : ''}`}>
                    <div className={styles.favIconContainer}>
                      <IoHeartOutline size={22} />
                      {totalWishlistItems > 0 && (
                        <span className={styles.cartCounter}>
                          {totalWishlistItems}
                        </span>
                      )}
                    </div>
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <div className={styles.userMenu} ref={userMenuRef}>
                  <div
                    className={styles.userAvatar}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    {getAvatarLetter()}
                  </div>
                                
                  {isAdmin && (
                    <button 
                      onClick={goToAdminDashboard} 
                      className={styles.adminButton}
                    >
                      Admin
                    </button>
                  )}
                  
                  <div
                    className={`${styles.userDropdown} ${
                      userMenuOpen ? styles.show : ""
                    }`}
                  >
                  
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className={styles.dropdownItem}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t("adminDashboard")}
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownItem}
                    >
                      {t("logout")} 
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.authLinks}>
                  <Link to="/login" className={`${styles.authLink} ${isActive('/login') ? styles.activeLink : ''}`}>
                    {t("loginet1")}
                  </Link>
                </div>
              )}

              <button
                className={styles.mobileMenuToggle}
                onClick={handleMobileMenuToggle}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <FiMenu size={24} className={styles.menuIcon} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Floating Controls - YALNIZ tablet və mobil üçün */}
      {isMobile && (
        <div className={styles.floatingControls}>
          <button 
            onClick={toggleTheme} 
            className={`${styles.floatingButton} ${styles.themeButton} ${isDarkMode ? styles.dark : styles.light}`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <BsSun size={18} /> : <BsMoon size={18} />}
          </button>
          
          <div className={styles.floatingLangDropdown}>
            <button 
              className={`${styles.floatingButton} ${styles.langButton} ${isDarkMode ? styles.dark : styles.light}`}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label="Change language"
            >
              <ReactCountryFlag
                countryCode={languages.find((l) => l.code === i18n.language)?.flag || "US"}
                svg
                style={{ width: '18px', height: '18px' }}
              />
            </button>
            
            {langMenuOpen && (
              <div className={`${styles.floatingLangMenu} ${isDarkMode ? styles.dark : styles.light}`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={styles.langOption}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <ReactCountryFlag countryCode={lang.flag} svg />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
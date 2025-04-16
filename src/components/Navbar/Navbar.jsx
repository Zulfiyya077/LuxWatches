import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "react-use-cart";
import styles from "./Navbar.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { FiShoppingCart } from "react-icons/fi";
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
  const userMenuRef = useRef(null);

  
  const isAdmin = user?.email === ADMIN_EMAIL;
 
  const isAdminDashboard = location.pathname === "/admin" || location.pathname.startsWith("/admin/");

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


  useEffect(() => {
    const handleClickOutside = (event) => {
     
      if (!mobileMenuOpen) return;
     
      const toggleButton = document.querySelector(`.${styles.mobileMenuToggle}`);
      
      
      const menuElement = document.querySelector(`.${styles.navLinks}`);
      
 
      if (
        toggleButton && 
        !toggleButton.contains(event.target) && 
        menuElement && 
        !menuElement.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, styles.mobileMenuToggle, styles.navLinks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
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


  const handleMobileMenuToggle = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  
  const goToAdminDashboard = () => {
    navigate('/admin');
    setUserMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          {/* <span className={styles.logoText}>LUXURY</span>
          <span className={styles.logoAccent}>WATCHES</span> */}
          
        <img className={styles.logoText} src="/videos/Screenshot Capture - 2025-04-14 - 02-25-33-Photoroom.png" alt="logo" />

        </Link>

        <div className={styles.menuWrapper}>
          <div
            className={`${styles.navLinks} ${
              mobileMenuOpen ? styles.active : ""
            }`}
          >
            <Link to="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              {t("home")}
            </Link>
            <Link to="/products" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              {t("products")}
            </Link>
            <Link to="/about" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              {t("about")}
            </Link>
            <Link to="/blog" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              {t("blog")}
            </Link>
            <Link to="/contact" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              {t("contact")}
            </Link>
      
          </div>

          <div className={styles.navActions}>
            <button onClick={toggleTheme} className={styles.themeToggle}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <div
              className={styles.langDropdown}
              onClick={(e) => {
                e.stopPropagation();
                setLangMenuOpen(!langMenuOpen);
              }}
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

                     {isAuthenticated && (!isAdmin || !isAdminDashboard) && (
              <>
                <Link to="/cart" className={styles.cartLink}>
                  <div className={styles.cartIconContainer}>
                    <FiShoppingCart size={24} />
                    {totalItems > 0 && (
                      <span className={styles.cartCounter}>{totalItems}</span>
                    )}
                  </div>
                </Link>

                <Link to="/favorites" className={styles.favLink}>
                  <div className={styles.favIconContainer}>
                    <span className={styles.icon}>❤️</span>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                >
                  {getAvatarLetter()}
                </div>
                
                <div 
                  className={styles.greeting}
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                >
                  Salam, {getUserDisplayName()}
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
                <Link to="/login" className={styles.authLink}>

                  {t("loginet1")}

                </Link>
              </div>
            )}
          </div>

          <button
            className={styles.mobileMenuToggle}
            onClick={handleMobileMenuToggle}
          >
            <span
              className={mobileMenuOpen ? styles.close : styles.hamburger}
            ></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
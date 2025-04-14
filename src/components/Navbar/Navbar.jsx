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
  const [searchQuery, setSearchQuery] = useState("");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Add loading state
  const userMenuRef = useRef(null);

  // Check if user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  // Check if currently on admin dashboard
  const isAdminDashboard = location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  // Check authentication state after a short delay to ensure it's loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 1000); // Give authentication 1 second to load
    
    return () => clearTimeout(timer);
  }, []);

  // Only redirect if authentication is not loading
  useEffect(() => {
    if (!authLoading) {
      if (isAdminDashboard && !isAdmin && isAuthenticated) {
        // If user is logged in but not admin, redirect to home
        navigate('/');
      } else if (isAdminDashboard && !isAuthenticated) {
        // If user is not logged in, redirect to login
        navigate('/login');
      }
    }
  }, [isAdminDashboard, isAdmin, isAuthenticated, navigate, authLoading]);

  // Rest of your existing functions
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only run if the menu is open
      if (!mobileMenuOpen) return;
      
      // Get the toggle button element
      const toggleButton = document.querySelector(`.${styles.mobileMenuToggle}`);
      
      // Get the menu element
      const menuElement = document.querySelector(`.${styles.navLinks}`);
      
      // Check if the click was outside both elements
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

  // Toggle mobile menu without propagating the event
  const handleMobileMenuToggle = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigate to admin dashboard
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
          <img className={styles.logoText} src="public/videos/Screenshot Capture - 2025-04-14 - 02-25-33-Photoroom.png" alt="logo"/>
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
            
            {/* Admin link removed from here */}
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

            {/* Only show cart and wishlist if not admin or not on admin dashboard */}
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
                
                {/* Admin button next to user avatar - only visible to admin */}
                {isAdmin && (
                  <button 
                    onClick={goToAdminDashboard} 
                    className={styles.adminButton} // We'll add this class in CSS
                  >
                    Admin
                  </button>
                )}
                
                <div
                  className={`${styles.userDropdown} ${
                    userMenuOpen ? styles.show : ""
                  }`}
                >
                  {/* Admin dashboard link in dropdown for admin user */}
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
                  {t("loginet")}
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
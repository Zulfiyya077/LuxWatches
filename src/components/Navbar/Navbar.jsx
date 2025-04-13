import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "react-use-cart";
import styles from "./Navbar.module.css";
import { ThemeContext } from "../../context/ThemeContext";
import { FiShoppingCart } from "react-icons/fi";
import ReactCountryFlag from "react-country-flag";
import { useWishlist } from "react-use-wishlist";
import { useUser  } from "../UserContext";
import supabase from "../../supabaseClient"; 

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, logout, user } = useUser ();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const getUserDisplayName = () => {
    if (user?.raw_user_meta_data?.full_name) {
      return user.raw_user_meta_data.full_name;
    } else if (user?.email) {
      return user.email.split('@')[0]; 
    }
    return "User ";
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



  const languages = [
    { code: "az", label: "AZ", flag: "AZ" },
    { code: "en", label: "EN", flag: "US" },
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLangMenuOpen(false);
  };

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


  // useEffect(() => {
  //   const loadUserData = async (userId) => {
  //     try {
  //       const { data: cartData } = await supabase
  //         .from('carts')
  //         .select('*')
  //         .eq('user_id', userId)
  //         .single();

  //       const { data: wishlistData } = await supabase
  //         .from('wishlists')
  //         .select('*')
  //         .eq('user_id', userId)
  //         .single();

  //       // Update cart and wishlist state if necessary
  //       // Assuming you have a way to set the cart and wishlist in your context or state
  //       // For example:
  //       // setCart(cartData.items);
  //       // setWishlist(wishlistData.items);
  //     } catch (err) {
  //       console.error('Səbət və ya istək siyahısı yüklənmədi:', err);
  //     }
  //   };

  //   if (isAuthenticated && user) {
  //     loadUserData(user.id);
  //   }
  // }, [isAuthenticated, user]);

  return (
    <nav className={`${styles.navbar} ${theme === "dark" ? styles.dark : ""}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>LUXURY</span>
          <span className={styles.logoAccent}>WATCHES</span>
        </Link>

        <div className={styles.menuWrapper}>
          <div
            className={`${styles.navLinks} ${
              mobileMenuOpen ? styles.active : ""
            }`}
          >
            <Link to="/" className={styles.navLink}>
              {t("home")}
            </Link>
            <Link to="/products" className={styles.navLink}>
              {t("products")}
            </Link>
            <Link to="/about" className={styles.navLink}>
              {t("about")}
            </Link>
            <Link to="/blog" className={styles.navLink}>
              {t("blog")}
            </Link>
            <Link to="/contact" className={styles.navLink}>
              {t("contact")}
            </Link>
          </div>

          <div className={styles.navActions}>
            <button onClick={toggleTheme} className={styles.themeToggle}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <div
              className={styles.langDropdown}
              onClick={() => setLangMenuOpen(!langMenuOpen)}
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

            {isAuthenticated && (
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
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {getAvatarLetter()}
                </div>
                <div 
                  className={styles.greeting}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  Salam, {getUserDisplayName()}
                </div>
                <div
                  className={`${styles.userDropdown} ${
                    userMenuOpen ? styles.show : ""
                  }`}
                >
                
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
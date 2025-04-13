import React, { useState, useEffect, useContext } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube, FaClock } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";
import { ThemeContext } from "../../context/ThemeContext"; 

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext); 
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

 
  const themeClass = theme === 'dark' ? styles.dark : styles.light;

  return (
    <footer className={`${styles.footer} ${themeClass}`}>
    
     

      <div className={styles.container}>
      
        <div className={styles.topSection}>
          <div className={`${styles.clockContainer} ${themeClass}`}>
            <FaClock className={styles.clockIcon} />
            <span className={styles.time}>{time.toLocaleTimeString()}</span>
          </div>
        </div>

   
        <div className={styles.grid}>
         
          <div className={styles.column}>
            <h3 className={`${styles.heading} ${themeClass}`}>
              {t("company")}
            </h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <a href="/about" className={`${styles.link} ${themeClass}`}>
                  <span className={styles.bullet}></span>
                  {t("about_us")}
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="/contact" className={`${styles.link} ${themeClass}`}>
                  <span className={styles.bullet}></span>
                  {t("contact")}
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="/faqs" className={`${styles.link} ${themeClass}`}>
                  <span className={styles.bullet}></span>
                  {t("faqs")}
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="/shipping" className={`${styles.link} ${themeClass}`}>
                  <span className={styles.bullet}></span>
                  {t("shipping_returns")}
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="/terms" className={`${styles.link} ${themeClass}`}>
                  <span className={styles.bullet}></span>
                  {t("terms_conditions")}
                </a>
              </li>
            </ul>
          </div>

         
          <div className={styles.column}>
            <h3 className={`${styles.heading} ${themeClass}`}>
              {t("customer_service")}
            </h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <a href="/privacy" className={`${styles.link} ${themeClass}`}>
                  <span className={styles.bullet}></span>
                  {t("privacy_policy")}
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="/help" className={`${styles.link} ${themeClass}`}>
                  <span className={styles.bullet}></span>
                  {t("help_center")}
                </a>
              </li>
              <li className={styles.linkItem}>
                <a href="/track" className={`${styles.link} ${themeClass}`}>
                  <span className={styles.bullet}></span>
                  {t("track_order")}
                </a>
              </li>
            </ul>
          </div>

        
          <div className={styles.column}>
            <h3 className={`${styles.heading} ${themeClass}`}>
              {t("contact_us")}
            </h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MdLocationOn className={`${styles.contactIcon} ${themeClass}`} />
                <span>123 Street, City, Country</span>
              </li>
              <li className={styles.contactItem}>
                <MdPhone className={`${styles.contactIcon} ${themeClass}`} />
                <span>+1 234 567 8900</span>
              </li>
              <li className={styles.contactItem}>
                <MdEmail className={`${styles.contactIcon} ${themeClass}`} />
                <span>info@example.com</span>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={`${styles.heading} ${themeClass}`}>
              {t("follow_us")}
            </h3>
            <div className={styles.socialContainer}>
              <a href="#" className={`${styles.socialIcon} ${styles.facebook} ${themeClass}`}>
                <FaFacebookF />
              </a>
              <a href="#" className={`${styles.socialIcon} ${styles.instagram} ${themeClass}`}>
                <FaInstagram />
              </a>
              <a href="#" className={`${styles.socialIcon} ${styles.twitter} ${themeClass}`}>
                <FaTwitter />
              </a>
              <a href="#" className={`${styles.socialIcon} ${styles.linkedin} ${themeClass}`}>
                <FaLinkedinIn />
              </a>
              <a href="#" className={`${styles.socialIcon} ${styles.youtube} ${themeClass}`}>
                <FaYoutube />
              </a>
            </div>

           
            <div className={styles.newsletter}>
              <h4 className={`${styles.newsletterHeading} ${themeClass}`}>{t("newsletter")}</h4>
              <div className={`${styles.subscribeForm} ${themeClass}`}>
                <input 
                  type="email" 
                  placeholder={t("email_placeholder") || "Enter your email"} 
                  className={`${styles.emailInput} ${themeClass}`} 
                />
                <button className={styles.subscribeButton}>
                  {t("subscribe") || "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <div className={`${styles.copyright} ${themeClass}`}>
          <p>
            &copy; {new Date().getFullYear()} {t("copyright") }
          </p>
       
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useContext } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; 
import styles from "./Footer.module.css";
import { ThemeContext } from "../../context/ThemeContext"; 


const FooterLink = ({ to, children, className }) => {
  const handleClick = () => {
    
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <Link 
      to={to} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext); 

  const themeClass = theme === 'dark' ? styles.dark : styles.light;

 
  const navigationLinks = {
    company: [
      { href: "/about", text: t("about_us") },
      { href: "/contact", text: t("contact") },
      { href: "/faqs", text: t("faqs") },
      { href: "/orders", text: t("shipping_returns") },
      { href: "/about", text: t("terms_conditions") }
    ],
    customerService: [
      { href: "/about", text: t("privacy_policy") },
      { href: "/about", text: t("help_center") },
      { href: "/orders", text: t("track_order") }
    ]
  };

  return (
    <footer className={`${styles.footer} ${themeClass}`}>
      <div className={styles.container}>
      
        <div className={styles.grid}>
         
          <div className={styles.column}>
            <h3 className={`${styles.heading} ${themeClass}`}>
              {t("company")}
            </h3>
            <ul className={styles.linkList}>
              {navigationLinks.company.map((link, index) => (
                <li key={index} className={styles.linkItem}>
                  <FooterLink to={link.href} className={`${styles.link} ${themeClass}`}>
                    <span className={styles.bullet}></span>
                    {link.text}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={`${styles.heading} ${themeClass}`}>
              {t("customer_service")}
            </h3>
            <ul className={styles.linkList}>
              {navigationLinks.customerService.map((link, index) => (
                <li key={index} className={styles.linkItem}>
                  <FooterLink to={link.href} className={`${styles.link} ${themeClass}`}>
                    <span className={styles.bullet}></span>
                    {link.text}
                  </FooterLink>
                </li>
              ))}
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
      <span>+994 12 123 45 67</span>
    </li>
    <li className={styles.contactItem}>
      <MdPhone className={`${styles.contactIcon} ${themeClass}`} />
      <span>+994 50 123 45 67</span>
    </li>
    <li className={styles.contactItem}>
      <MdEmail className={`${styles.contactIcon} ${themeClass}`} />
      <span>info@luxurywatches.az</span>
    </li>
    <li className={styles.contactItem}>
      <MdEmail className={`${styles.contactIcon} ${themeClass}`} />
      <span>support@luxurywatches.az</span>
    </li>
   
  </ul>
</div>


          <div className={styles.column}>
            <h3 className={`${styles.heading} ${themeClass}`}>
              {t("follow_us")}
            </h3>
            <div className={styles.socialContainer}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.facebook} ${themeClass}`}>
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.instagram} ${themeClass}`}>
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.twitter} ${themeClass}`}>
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.linkedin} ${themeClass}`}>
                <FaLinkedinIn />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={`${styles.socialIcon} ${styles.youtube} ${themeClass}`}>
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
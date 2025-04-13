import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../context/ThemeContext';
import styles from './Contact.module.css';

const Contact = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);  

  return (
    <section className={`${styles.contactSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t('contactUs')}</h2>
        <p className={styles.sectionDescription}>{t('contactDescription')}</p>

        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <h3>{t('support')}</h3>
            <p>+994 50 123 45 67</p>
          </div>
          <div className={styles.contactItem}>
            <h3>{t('email')}</h3>
            <p>support@luxurywatches.com</p>
          </div>
          <div className={styles.contactItem}>
            <h3>{t('additionalInfo')}</h3>
            <p>{t('additionalInfoDescription')}</p>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>{t('submitQuery')}</h3>
          <form className={styles.contactForm}>
            <input type="text" placeholder={t('yourName')} className={styles.formInput} />
            <input type="email" placeholder={t('emailAddress')} className={styles.formInput} />
            <textarea placeholder={t('message')} className={styles.formTextarea} />
            <button type="submit" className={styles.submitButton}>{t('submitQuery')}</button>
          </form>
        </div>

        <div className={styles.officeInfo}>
          <h3>{t('ourOffice')}</h3>
          <p>{t('visitUs')}</p>
          <div className={styles.officeDetails}>
            <p>{t('officeAddress')}</p>
            <p>Baku, Nərimanov Rayon, 123 Luxury Watch Ave</p>
            <p>{t('workingHours')}</p>
            <p>9 AM - 7 PM</p>
          </div>
          <div className={styles.officeImage}>
            <img src="/public/images/rolexstore.webp" alt="Rolex Store" className={styles.officeImage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;


import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Contact.module.css';

const Contact = () => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful submission
    
    // Show success toast notification
    toast.success(t('successMessage2') || 'Your message has been sent successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: theme === 'dark' ? 'dark' : 'light',
    });
    
    // Reset form fields
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <section className={`${styles.contactSection} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <ToastContainer />
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
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name"
              placeholder={t('yourName')} 
              className={styles.formInput} 
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input 
              type="email" 
              name="email"
              placeholder={t('emailAddress')} 
              className={styles.formInput} 
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea 
              name="message"
              placeholder={t('message')} 
              className={styles.formTextarea}
              value={formData.message}
              onChange={handleChange}
              required
            />
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
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ThankYou.module.css';
import { ThemeContext } from '../../context/ThemeContext';
import RecommendedProducts from '../../components/RecommendedProducts/RecommendedProducts';

const ThankYou = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = t('thankYou.pageTitle') || 'Sifarişiniz üçün Təşəkkürlər';
    
    // Poppins fontunu əlavə et
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [t]);

  const getThemedClass = (baseClass) => {
    return theme === 'dark' ? `${baseClass} ${styles[`${baseClass}Dark`]}` : styles[baseClass];
  };
  
  const getOrderNumber = () => {
    const savedOrderNumber = sessionStorage.getItem('orderNumber');
    if (savedOrderNumber) {
      return savedOrderNumber;
    }
 
    const newOrderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('orderNumber', newOrderNumber);
    return newOrderNumber;
  };

  const getEstimatedDeliveryDate = () => {
    const deliveryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return deliveryDate.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.containerDark : ''}`}>
      <div className={`${styles.formWrapper} ${theme === 'dark' ? styles.formWrapperDark : ''}`}>
        <div className={`${styles.formContainer} ${theme === 'dark' ? styles.formContainerDark : ''}`}>
          <div className={styles.logo}>
            <span className={`${styles.logoText} ${theme === 'dark' ? styles.logoTextDark : ''}`}>
              {t('common.companyName.luxury')}
            </span>
          </div>

          <div className={styles.thankYouContent}>
            <div className={`${styles.checkmarkCircle} ${theme === 'dark' ? styles.checkmarkCircleDark : ''}`}>
              <span className={styles.checkmark}>✓</span>
            </div>

            <h1 className={`${styles.title} ${theme === 'dark' ? styles.titleDark : ''}`}>
              {t('thankYou.mainTitle')}
            </h1>

            <p className={`${styles.subtitle} ${theme === 'dark' ? styles.subtitleDark : ''}`}>
              {t('thankYou.subtitle')}
            </p>

            <div className={`${styles.orderDetails} ${theme === 'dark' ? styles.orderDetailsDark : ''}`}>
              <div className={styles.detailItem}>
                <span className={`${styles.detailLabel} ${theme === 'dark' ? styles.detailLabelDark : ''}`}>
                  {t('thankYou.orderNumber')}
                </span>
                <span className={`${styles.detailValue} ${theme === 'dark' ? styles.detailValueDark : ''}`}>
                  #{getOrderNumber()}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={`${styles.detailLabel} ${theme === 'dark' ? styles.detailLabelDark : ''}`}>
                  {t('thankYou.estimatedDelivery')}
                </span>
                <span className={`${styles.detailValue} ${theme === 'dark' ? styles.detailValueDark : ''}`}>
                  {getEstimatedDeliveryDate()}
                </span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={`${styles.primaryButton} ${theme === 'dark' ? styles.primaryButtonDark : ''}`}
                onClick={() => navigate('/products')}
                aria-label={t('thankYou.continueShopping')}
              >
                {t('thankYou.continueShopping')}
              </button>

              <button
                className={`${styles.secondaryButton} ${theme === 'dark' ? styles.secondaryButtonDark : ''}`}
                onClick={() => navigate('/orders')}
                aria-label={t('thankYou.viewOrder')}
              >
                {t('thankYou.viewOrder')}
              </button>
            </div>
          </div>
        </div>

        <div className={`${styles.banner} ${theme === 'dark' ? styles.bannerDark : ''}`}>
          <div className={styles.bannerContent}>
            <h2 className={`${styles.bannerTitle} ${theme === 'dark' ? styles.bannerTitleDark : ''}`}>
              {t('thankYou.benefits.title')}
            </h2>
            <div className={styles.separator}></div>
            <p className={`${styles.bannerSubtitle} ${theme === 'dark' ? styles.bannerSubtitleDark : ''}`}>
              {t('thankYou.benefits.subtitle')}
            </p>

            <ul className={styles.benefitsList}>
              {[
                { icon: '📦', key: 'freeShipping' },
                { icon: '🔄', key: 'easyReturn' },
                { icon: '🛡️', key: 'guarantee' },
                { icon: '💳', key: 'securePayment' },
              ].map((benefit) => (
                <li key={benefit.key} className={`${styles.benefitItem} ${theme === 'dark' ? styles.benefitItemDark : ''}`}>
                  <span className={styles.benefitIcon}>{benefit.icon}</span>
                  <span>{t(`thankYou.benefits.${benefit.key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={`${styles.recommendedWrapper} ${theme === 'dark' ? styles.recommendedWrapperDark : ''}`}>
        <RecommendedProducts />
      </div>
    </div>
  );
};

export default ThankYou;
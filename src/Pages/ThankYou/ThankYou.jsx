import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './ThankYou.module.css';
import { ThemeContext } from '../../context/ThemeContext';
import RecommendedProducts from '../../components/RecommendedProducts/RecommendedProducts';

const ThankYou = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const getThemedClass = (baseClass) => {
    return theme === 'dark' ? `${baseClass} ${baseClass}Dark` : baseClass;
  };

  return (
    <div className={getThemedClass(styles.container)}>
      <div className={getThemedClass(styles.formWrapper)}>
        <div className={getThemedClass(styles.formContainer)}>
          <div className={styles.logo}>
            <span className={getThemedClass(styles.logoText)}>
              {t('common.companyName.luxury')}
            </span>
            <span className={getThemedClass(styles.logoAccent)}>
              {t('common.companyName.shop')}
            </span>
          </div>

          <div className={styles.thankYouContent}>
            <div className={getThemedClass(styles.checkmarkCircle)}>
              <span className={getThemedClass(styles.checkmark)}>✓</span>
            </div>

            <h1 className={getThemedClass(styles.title)}>
              {t('thankYou.mainTitle')}
            </h1>

            <p className={getThemedClass(styles.subtitle)}>
              {t('thankYou.subtitle')}
            </p>

            <div className={getThemedClass(styles.orderDetails)}>
              <div className={styles.detailItem}>
                <span className={getThemedClass(styles.detailLabel)}>
                  {t('thankYou.orderNumber')}
                </span>
                <span className={getThemedClass(styles.detailValue)}>
                  #{Math.floor(Math.random() * 100000)}
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={getThemedClass(styles.detailLabel)}>
                  {t('thankYou.estimatedDelivery')}
                </span>
                <span className={getThemedClass(styles.detailValue)}>
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(i18n.language)}
                </span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button
                className={getThemedClass(styles.primaryButton)}
                onClick={() => navigate('/products')}
              >
                {t('thankYou.continueShopping')}
              </button>

              <button
                className={getThemedClass(styles.secondaryButton)}
                onClick={() => navigate('/orders')}
              >
                {t('thankYou.viewOrder')}
              </button>
            </div>
          </div>
        </div>

        <div className={getThemedClass(styles.banner)}>
          <div className={styles.bannerContent}>
            <h2 className={getThemedClass(styles.bannerTitle)}>
              {t('thankYou.benefits.title')}
            </h2>
            <div className={styles.separator}></div>
            <p className={getThemedClass(styles.bannerSubtitle)}>
              {t('thankYou.benefits.subtitle')}
            </p>

            <ul className={styles.benefitsList}>
              {[
                { icon: '📦', key: 'freeShipping' },
                { icon: '🔄', key: 'easyReturn' },
                { icon: '🛡️', key: 'guarantee' },
                { icon: '💳', key: 'securePayment' },
              ].map((benefit) => (
                <li key={benefit.key} className={getThemedClass(styles.benefitItem)}>
                  <span className={styles.benefitIcon}>{benefit.icon}</span>
                  <span>{t(`thankYou.benefits.${benefit.key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      
      <div className={getThemedClass(styles.recommendedWrapper)}>
        <RecommendedProducts />
      </div>
    </div>
  );
};

export default ThankYou;

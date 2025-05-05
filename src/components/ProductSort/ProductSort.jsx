import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProductSort.module.css';

const ProductSort = ({ onSortChange, defaultValue = 'price_asc' }) => {
  const { t } = useTranslation();
  const [currentSort, setCurrentSort] = useState(defaultValue);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setCurrentSort(value);
    onSortChange(value);
  };

  return (
    <div className={styles.sortContainer}>
      <label htmlFor="sort" className={styles.sortLabel}>
        {t('sort.label')}
      </label>
      <select 
        id="sort" 
        value={currentSort}
        onChange={handleSortChange} 
        className={styles.sortSelect}
        aria-label={t('sort.aria_label')}
      >
        <option className={styles.optcol} value="price_asc">{t('sort.price_asc')}</option>
        <option value="price_desc">{t('sort.price_desc')}</option>
        <option value="name_asc">{t('sort.name_asc')}</option>
        <option value="name_desc">{t('sort.name_desc')}</option>
        <option value="discounted">{t('sort.discounted')}</option>
      </select>
    </div>
  );
};

export default ProductSort;
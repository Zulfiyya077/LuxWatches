import React from 'react';
import styles from './ProductSort.module.css';

const ProductSort = ({ onSortChange }) => {
  const handleSortChange = (e) => {
    onSortChange(e.target.value); 
  };

  return (
    <div className={styles.sortContainer}>
      <label htmlFor="sort" className={styles.sortLabel}>Məhsulları sırala:</label>
      <select id="sort" onChange={handleSortChange} className={styles.sortSelect}>
        <option value="price_asc">Qiymət: Aşağıdan Yuxarıya</option>
        <option value="price_desc">Qiymət: Yuxarıdan Aşağıya</option>
        <option value="name_asc">Ad: A - Z</option>
        <option value="name_desc">Ad: Z - A</option>
        <option value="discounted">Endirimli Məhsullar</option>
      </select>
    </div>
  );
};

export default ProductSort;

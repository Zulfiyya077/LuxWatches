// import React, { useState } from "react";
// import ProductCard from "./ProductCard";
// import styles from "./ProductList.module.css";

// const ProductList = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   const products = [
//     {
//       name: "Rolex Submariner",
//       price: "23,500",
//       image: "/images/rolex-submariner.jpg",
//     },
//     {
//       name: "Rolex Daytona",
//       price: "35,700",
//       image: "/images/rolex-daytona.jpg",
//     },
//     {
//       name: "Rolex Datejust",
//       price: "14,800",
//       image: "/images/rolex-datejust.jpg",
//     },
//   ];

//   return (
//     <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
//       <button className={styles.toggleButton} onClick={() => setDarkMode(!darkMode)}>
//         {darkMode ? "Light Mode" : "Dark Mode"}
//       </button>
//       <div className={styles.productGrid}>
//         {products.map((product, index) => (
//           <ProductCard key={index} product={product} darkMode={darkMode} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductList;

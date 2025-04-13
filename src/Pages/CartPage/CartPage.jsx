import React, { useEffect, useState, useContext } from "react";
import { useCart } from "react-use-cart";
import styles from "./CartPage.module.css";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import supabase from "../../supabaseClient";


const CartPage = () => {
  const { theme } = useContext(ThemeContext);
  const { items, updateItemQuantity, removeItem } = useCart();
  const [cartItems, setCartItems] = useState(items);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.discounted ? item.discountedPrice : item.price;
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

 
  const updateCartInSupabase = async () => {
    const { data: user, error } = await supabase.auth.getUser(); 

    if (error) {
      console.error("Error getting user:", error);
      return;
    }

    const userId = user?.id; 

    if (!userId) {
      console.log("User not logged in.");
      return;
    }

    // Sebeti yenilə
    const { data, error: updateError } = await supabase
      .from('carts')
      .upsert({
        user_id: userId,
        items: cartItems, 
        updated_at: new Date(),
      });

    if (updateError) {
      console.error("Error updating cart:", updateError);
    } else {
      console.log("Cart updated successfully:", data);
    }
  };

  useEffect(() => {
    
    setCartItems(items);
    updateCartInSupabase(); 
  }, [items]); 

  return (
    <div className={`${styles.cartPage} ${theme === "dark" ? styles.darkMode : ""}`}>
      <h1 className={styles.basket}>Səbətiniz</h1>
      {items.length === 0 ? (
        <p>Səbətiniz boşdur.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <img src={item.image} alt={item.name} className={styles.cartItemImage} />
            <div className={styles.cartItemDetails}>
              <h3>{item.name}</h3>
              <p>
                {item.discounted ? (
                  <>
                    <span className={styles.discountedPrice}>{item.discountedPrice} USD</span>
                  </>
                ) : (
                  <span>{item.price} USD</span>
                )}
              </p>
              <div className={styles.quantityControl}>
                <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item.id)}>Sil</button>
            </div>
          </div>
        ))
      )}
      <div className={styles.total}>
        <h3>Cəm: {calculateTotal()} USD</h3>
      </div>
      <Link to="/checkout">
        <button className={styles.checkoutButton}>Ödəniş et</button>
      </Link>
    </div>
  );
};

export default CartPage;

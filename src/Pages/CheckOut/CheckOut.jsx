import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { useTranslation } from "react-i18next";
import styles from "./Checkout.module.css";

const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardHolder, setCardHolder] = useState("");
  const [cardError, setCardError] = useState(null);
  const { t } = useTranslation();
  const { isEmpty, items, emptyCart } = useCart();
  const navigate = useNavigate();

  const getDiscountedPrice = (item) => {
    return item.discountPrice !== undefined && item.discountPrice !== null
      ? item.discountPrice
      : item.price;
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const priceToUse = getDiscountedPrice(item);
      return total + priceToUse * item.quantity;
    }, 0);
  };

  const calculatedTotal = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      emptyCart();

      navigate("/thankyou");
    }, 500);
  };

  if (isEmpty) {
    return (
      <div className={styles.emptyCartMessage}>
        <h2>{t("checkout.emptyCart")}</h2>
        <p>{t("checkout.addItemsFirst")}</p>
        <button
          onClick={() => navigate("/products")}
          className={styles.shopButton}
        >
          {t("checkout.returnToProducts")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.totalAmount}>
        <h2>{t("checkout.total", { amount: calculatedTotal.toFixed(2) })}</h2>
      </div>

      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.cardFront}>
            <div className={styles.cardChip}></div>
            <div className={styles.cardLogo}>
              <span className={styles.bankName}>Premium Bank</span>
            </div>
            <div className={styles.cardNumber}>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      </div>

      {cardError && <div className={styles.error}>{cardError}</div>}

      <div className={styles.cardActions}>
        <button
          type="submit"
          className={styles.payButton}
          disabled={loading || isEmpty}
        >
          {loading ? t("checkout.processing") : t("checkout.pay")}
        </button>
      </div>
    </form>
  );
};

const CheckoutPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.checkoutContainer}>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default CheckoutPage;

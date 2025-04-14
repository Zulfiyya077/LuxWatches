import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./ShippingReturns.module.css";

const ShippingReturns = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{t("shipping_returns")}</h1>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("shipping_policy")}</h2>
        <div className={styles.content}>
          <h3 className={styles.subTitle}>{t("shipping_methods")}</h3>
          <p className={styles.paragraph}>
            {t("shipping_methods_content")}
          </p>
          
          <h3 className={styles.subTitle}>{t("delivery_times")}</h3>
          <p className={styles.paragraph}>
            {t("delivery_times_content")}
          </p>
          
          <h3 className={styles.subTitle}>{t("shipping_costs")}</h3>
          <p className={styles.paragraph}>
            {t("shipping_costs_content")}
          </p>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("returns_policy")}</h2>
        <div className={styles.content}>
          <h3 className={styles.subTitle}>{t("return_eligibility")}</h3>
          <p className={styles.paragraph}>
            {t("return_eligibility_content")}
          </p>
          
          <h3 className={styles.subTitle}>{t("return_process")}</h3>
          <p className={styles.paragraph}>
            {t("return_process_content")}
          </p>
          
          <h3 className={styles.subTitle}>{t("refund_policy")}</h3>
          <p className={styles.paragraph}>
            {t("refund_policy_content")}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ShippingReturns;
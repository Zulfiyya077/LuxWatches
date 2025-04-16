import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import az from "../locales/az.json";

// Get saved language from localStorage or use the default
const savedLanguage = localStorage.getItem('language') || 'az'; 

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      az: { translation: az }
    },
    lng: savedLanguage,
    fallbackLng: 'az',
    interpolation: {
      escapeValue: false
    },
    // Set debug to false in production
    debug: process.env.NODE_ENV === 'development'
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
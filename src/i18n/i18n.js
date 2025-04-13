import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import az from "../locales/az.json";

const savedLanguage = localStorage.getItem('language') || 'az'; 

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      az: { translation: az },
      
    },
    lng: savedLanguage, 
    fallbackLng: 'az', 
    interpolation: {
      escapeValue: false, 
    },
    debug: true, 
  });


i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng); 
});

export default i18n;

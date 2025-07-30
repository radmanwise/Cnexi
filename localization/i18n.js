import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import fa from '../locales/fa.json';
import * as Localization from 'expo-localization'; 

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3', 
  lng: Localization.locale, 
  fallbackLng: 'en', 
  resources: {
    en: {
      translation: en,
    },
    fa: {
      translation: fa,
    },
  },
  interpolation: {
    escapeValue: false, 
  },
});

export default i18n;
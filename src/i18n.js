import "intl-pluralrules";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: require('./locale/en.json'),
  },
  ca: {
    translation: require('./locale/ca.json'),
  },
  es: {
    translation: require('./locale/es.json'),
  },
  eo: {
    translation: require('./locale/eo.json'),
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", 
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

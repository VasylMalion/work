import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import config from '../config/config';

import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-locize-backend';

const locizeOptions = {
  projectId: config.locize.projectId,
  apiKey: config.locize.apiKey,
  referenceLng: 'en',
};

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  fallbackLng: 'en',
  debug: false,
  saveMissing: false,
  lang: LanguageDetector,
  ns: ['Web'],
  defaultNS: 'Web',
  interpolation: {
    escapeValue: false,
  },
  backend: locizeOptions,
});

export default i18n;

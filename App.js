import Navigation from './Navigation';
import { QuestionProvider } from './src/context/QuestionContext';

import { RoundProvider } from "./src/context/RoundContext";
import { LanguageProvider } from './src/contexts/LanguageContext';
import i18n from "./src/i18n";
import { getLocales } from "expo-localization";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Set the initial language based on device locale
    const locale = getLocales()[0].languageCode.trim();
    i18n.changeLanguage(locale);
}, []);

  return (
      <QuestionProvider>
        <RoundProvider>
          <LanguageProvider>
          <Navigation />
        </LanguageProvider>
        </RoundProvider>
      </QuestionProvider>
  );
}
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { i18nApi } from '../../services/api';

interface Language {
  name: string;
  country: string;
  flag: string;
}

interface LanguageSelectorProps {
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const [languages, setLanguages] = useState<Record<string, Language>>({});
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const data = await i18nApi.getLanguages();
        setLanguages(data);
        
        // Get current language from localStorage or detect
        const savedLang = localStorage.getItem('language');
        if (savedLang && data[savedLang]) {
          setCurrentLanguage(savedLang);
        } else {
          const detected = await i18nApi.detectLanguage();
          setCurrentLanguage(detected.detected);
        }
      } catch (error) {
        console.error('Error loading languages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    try {
      setCurrentLanguage(langCode);
      localStorage.setItem('language', langCode);
      
      // Load translations for the selected language
      await i18nApi.getTranslations(langCode);
      
      // Reload page to apply language changes
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
    }
    onClose();
  };

  if (loading) {
    return (
      <div className="absolute right-0 mt-2 w-64 bg-dark-300 border border-dark-400 rounded-lg shadow-lg py-2 z-50">
        <div className="px-4 py-2 text-gray-400 text-sm">Loading languages...</div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-64 bg-dark-300 border border-dark-400 rounded-lg shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
      <div className="px-4 py-2 border-b border-dark-400">
        <h3 className="text-sm font-medium text-white">Select Language</h3>
      </div>
      
      <div className="py-1">
        {Object.entries(languages).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={`w-full px-4 py-2 text-left hover:bg-dark-200 transition-colors flex items-center justify-between ${
              currentLanguage === code ? 'bg-dark-200' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">{lang.flag}</span>
              <div>
                <div className="text-white text-sm font-medium">{lang.name}</div>
                <div className="text-gray-400 text-xs">{lang.country}</div>
              </div>
            </div>
            {currentLanguage === code && (
              <Check size={16} className="text-primary-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
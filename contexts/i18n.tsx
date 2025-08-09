import React, { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'hi' | 'en';

type Dict = Record<string, { en: string; hi: string }>; 

const strings: Dict = {
  welcome: { hi: 'स्वागत है', en: 'Welcome' },
  register_to_create: { hi: 'नया खाता बनाने के लिए पंजीकरण करें', en: 'Register to create your account' },
  pacs_member: { hi: 'पैक्स सदस्य?', en: 'PACS member?' },
  pacs_name: { hi: 'पैक्स नाम', en: 'PACS name' },
  district: { hi: 'ज़िला', en: 'District' },
  block: { hi: 'विकास खंड', en: 'Block' },
  committee: { hi: 'समिति', en: 'Committee' },
  aadhaar: { hi: 'आधार कार्ड', en: 'Aadhaar' },
  mobile: { hi: 'मोबाइल नंबर', en: 'Mobile' },
  father_name: { hi: 'पिता का नाम', en: "Father's name" },
  land_area: { hi: 'भूमि क्षेत्र (हेक्टेयर)', en: 'Land area (ha)' },
  khasra: { hi: 'खसरा/खतौनी', en: 'Khasra' },
  farmer_type: { hi: 'किसान का प्रकार', en: 'Farmer type' },
  crop_season: { hi: 'खेती की प्रकार', en: 'Crop season' },
  submit_register: { hi: 'पंजीकरण करें', en: 'Register' },
  continue: { hi: 'जारी करें', en: 'Continue' },
  choose_language: { hi: 'भाषा चुने', en: 'Choose language' },
  pick_preferred_language: { hi: 'अपनी पसंदीदा भाषा चुने', en: 'Pick your preferred language' },
  kcc_request: { hi: 'केसीसी ऋण – अनुरोध', en: 'KCC Loan – Request' },
  crop: { hi: 'फसल का प्रकार', en: 'Crop' },
  amount: { hi: 'धन राशि', en: 'Amount' },
  tenure: { hi: 'समय', en: 'Tenure' },
  pacs: { hi: 'बी-पैक्स', en: 'PACS' },
  profile: { hi: 'मेरी प्रोफाइल', en: 'My Profile' },
  request: { hi: 'अनुरोध करें', en: 'Submit' },
  // Help and validation
  help_aadhaar: { hi: '12 अंकों का आधार दर्ज करें (2-9 से शुरू)', en: 'Enter 12-digit Aadhaar (starts with 2-9)' },
  err_aadhaar: { hi: 'वैध आधार दर्ज करें', en: 'Enter a valid Aadhaar' },
  help_mobile: { hi: '10 अंकों का मोबाइल (6-9 से शुरू)', en: '10-digit mobile (starts 6-9)' },
  err_mobile: { hi: 'वैध मोबाइल दर्ज करें', en: 'Enter a valid mobile' },
  help_land: { hi: 'हेक्टेयर में भूमि क्षेत्र (> 0)', en: 'Land area in ha (> 0)' },
  err_required: { hi: 'यह फ़ील्ड आवश्यक है', en: 'This field is required' },
  registered_ok: { hi: 'पंजीकरण सफल', en: 'Registration successful' },
};

function mkT(lang: Lang) {
  return (key: keyof typeof strings, fallback?: string) => strings[key]?.[lang] ?? fallback ?? key;
}

const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: ReturnType<typeof mkT> } | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>('hi');
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const stored = (await AsyncStorage.getItem('app_lang')) as Lang | null;
        if (stored === 'hi' || stored === 'en') setLangState(stored);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setLang = async (l: Lang) => {
    setLangState(l);
    await AsyncStorage.setItem('app_lang', l);
  };

  const value = React.useMemo(() => ({ lang, setLang, t: mkT(lang) }), [lang]);

  if (!ready) return null; // splash could be shown here
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

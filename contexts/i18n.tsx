import React, { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lang = 'hi' | 'en';

type Dict = Record<string, { en: string; hi: string }>; 

const strings: Dict = {
  welcome: { hi: 'स्वागत है', en: 'Welcome' },
  welcome_name: { hi: 'स्वागत है, {name}', en: 'Welcome, {name}' },
  register_to_create: { hi: 'नया खाता बनाने के लिए पंजीकरण करें', en: 'Register to create your account' },
  add_member_details: { hi: 'सदस्य विवरण जोड़ें', en: 'Add member details' },
  pacs_member: { hi: 'पैक्स सदस्य?', en: 'PACS member?' },
  pacs_name: { hi: 'पैक्स नाम', en: 'PACS name' },
  district: { hi: 'ज़िला', en: 'District' },
  block: { hi: 'विकास खंड', en: 'Block' },
  committee: { hi: 'समिति', en: 'Committee' },
  society: { hi: 'समिति का नाम', en: 'Society' },
  enter_society: { hi: 'समिति/सहकारी का नाम दर्ज करें', en: 'Enter society/cooperative name' },
  aadhaar: { hi: 'आधार कार्ड', en: 'Aadhaar' },
  mobile: { hi: 'मोबाइल नंबर', en: 'Mobile' },
  name: { hi: 'नाम', en: 'Name' },
  email: { hi: 'ईमेल', en: 'Email' },
  village: { hi: 'गांव', en: 'Village' },
  tehsil: { hi: 'तहसील', en: 'Tehsil' },
  pincode: { hi: 'पिन कोड', en: 'Pincode' },
  bank_name: { hi: 'बैंक का नाम', en: 'Bank name' },
  bank_account: { hi: 'बैंक खाता संख्या', en: 'Bank account number' },
  ifsc: { hi: 'IFSC कोड', en: 'IFSC code' },
  father_name: { hi: 'पिता का नाम', en: "Father's name" },
  land_area: { hi: 'भूमि क्षेत्र (हेक्टेयर)', en: 'Land area (ha)' },
  khasra: { hi: 'खसरा/खतौनी', en: 'Khasra' },
  farmer_type: { hi: 'किसान का प्रकार', en: 'Farmer type' },
  crop_season: { hi: 'खेती की प्रकार', en: 'Crop season' },
  submit_register: { hi: 'पंजीकरण करें', en: 'Register' },
  continue: { hi: 'जारी करें', en: 'Continue' },
  choose_language: { hi: 'भाषा चुने', en: 'Choose language' },
  pick_preferred_language: { hi: 'अपनी पसंदीदा भाषा चुने', en: 'Pick your preferred language' },
  registration: { hi: 'पंजीकरण', en: 'Registration' },
  loading: { hi: 'लोड हो रहा है...', en: 'Loading...' },
  empty_list: { hi: 'यहाँ अभी कुछ नहीं है', en: 'Nothing here yet' },
  no_results: { hi: 'कोई परिणाम नहीं मिला', en: 'No results found' },
  retry: { hi: 'पुनः प्रयास करें', en: 'Retry' },
  view: { hi: 'देखें', en: 'View' },
  download: { hi: 'डाउनलोड', en: 'Download' },
  apply_now: { hi: 'अभी आवेदन करें', en: 'Apply now' },
  details: { hi: 'विवरण', en: 'Details' },
  eligibility: { hi: 'पात्रता', en: 'Eligibility' },
  select: { hi: 'चुनें', en: 'Select' },
  search: { hi: 'खोजें...', en: 'Search...' },
  select_pacs: { hi: 'पैक्स चुनें', en: 'Select PACS' },
  select_district: { hi: 'जिला चुनें', en: 'Select district' },
  select_block: { hi: 'ब्लॉक चुनें', en: 'Select block' },
  select_tehsil: { hi: 'तहसील चुनें', en: 'Select tehsil' },
  select_committee: { hi: 'समिति चुनें', en: 'Select committee' },
  pmkisan_title: { hi: 'पीएम किसान सम्मान निधि योजना', en: 'PM-Kisan Samman Nidhi Yojana' },
  pmkisan_sub: { hi: 'लाभ, पात्रता और आवेदन प्रक्रिया', en: 'Benefits, eligibility, and how to apply' },
  kcc_request: { hi: 'केसीसी ऋण – अनुरोध', en: 'KCC Loan – Request' },
  crop: { hi: 'फसल का प्रकार', en: 'Crop' },
  amount: { hi: 'धन राशि', en: 'Amount' },
  tenure: { hi: 'समय', en: 'Tenure' },
  pacs: { hi: 'बी-पैक्स', en: 'PACS' },
  profile: { hi: 'मेरी प्रोफाइल', en: 'My Profile' },
  profile_edit: { hi: 'प्रोफाइल संपादन', en: 'Edit Profile' },
  my_info: { hi: 'मेरी जानकारी', en: 'My Info' },
  edit_info: { hi: 'जानकारी संपादित करें', en: 'Edit info' },
  sign_out: { hi: 'साइन आउट', en: 'Sign out' },
  find_categories: { hi: 'उपलब्ध सेवाएं', en: 'Available Services' },
  available_services: { hi: 'उपलब्ध सेवाएं', en: 'Available Services' },
  create_account: { hi: 'खाता बनाएं', en: 'Create Account' },
  sign_in: { hi: 'साइन इन', en: 'Sign In' },
  signup_subtitle: { hi: 'किसान समुदाय में शामिल हों', en: 'Join the farmer community' },
  signin_subtitle: { hi: 'वापस स्वागत है, किसान', en: 'Welcome back, farmer' },
  full_name: { hi: 'पूरा नाम', en: 'Full Name' },
  enter_name: { hi: 'अपना पूरा नाम दर्ज करें', en: 'Enter your full name' },
  already_have_account: { hi: 'पहले से खाता है?', en: 'Already have an account?' },
  dont_have_account: { hi: 'खाता नहीं है?', en: "Don't have an account?" },
  sign_up: { hi: 'साइन अप', en: 'Sign Up' },
  authentication: { hi: 'प्रमाणीकरण', en: 'Authentication' },
  // Home tiles
  fertilizer: { hi: 'उर्वरक', en: 'Fertilizer' },
  pacs_services: { hi: 'पैक्स सेवाएं', en: 'PACS Services' },
  procurement_status: { hi: 'खरीद की स्थिति', en: 'Procurement Status' },
  govt_schemes: { hi: 'सरकारी योजनाएं', en: 'Govt Schemes' },
  pacs_directory: { hi: 'बी-पैक्स देखें', en: 'PACS Directory' },
  certificates: { hi: 'प्रमाण पत्र', en: 'Certificates' },
  settings: { hi: 'सेटिंग्स', en: 'Settings' },
  my_profile: { hi: 'मेरी प्रोफाइल', en: 'My Profile' },
  // Settings
  language: { hi: 'भाषा', en: 'Language' },
  developer: { hi: 'डेवलपर', en: 'Developer' },
  mock_otp: { hi: 'मॉक ओटीपी', en: 'Mock OTP' },
  request: { hi: 'अनुरोध करें', en: 'Submit' },
  added_to_cart: { hi: 'कार्ट में जोड़ा गया', en: 'Added to cart' },
  request_submitted: { hi: 'अनुरोध भेजा गया', en: 'Request submitted' },
  // Help and validation
  help_aadhaar: { hi: '12 अंकों का आधार दर्ज करें (2-9 से शुरू)', en: 'Enter 12-digit Aadhaar (starts with 2-9)' },
  err_aadhaar: { hi: 'वैध आधार दर्ज करें', en: 'Enter a valid Aadhaar' },
  help_mobile: { hi: '10 अंकों का मोबाइल (6-9 से शुरू)', en: '10-digit mobile (starts 6-9)' },
  err_mobile: { hi: 'वैध मोबाइल दर्ज करें', en: 'Enter a valid mobile' },
  help_land: { hi: 'हेक्टेयर में भूमि क्षेत्र (> 0)', en: 'Land area in ha (> 0)' },
  err_required: { hi: 'यह फ़ील्ड आवश्यक है', en: 'This field is required' },
  err_email: { hi: 'वैध ईमेल दर्ज करें', en: 'Enter a valid email' },
  err_pincode: { hi: '6 अंकों का वैध पिन कोड दर्ज करें', en: 'Enter a valid 6-digit pincode' },
  err_ifsc: { hi: '11-अक्षर का वैध IFSC दर्ज करें', en: 'Enter a valid 11-char IFSC' },
  // OTP
  otp_verification: { hi: 'ओटीपी सत्यापन', en: 'OTP Verification' },
  send_otp: { hi: 'ओटीपी भेजें', en: 'Send OTP' },
  resend_code: { hi: 'पुनः कोड भेजें', en: 'Resend code' },
  proceed: { hi: 'जारी करें', en: 'Proceed' },
  mock_otp_enabled_msg: { hi: 'मॉक ओटीपी चालू है। आगे बढ़ने के लिए {code} उपयोग करें।', en: 'Mock OTP enabled. Use code {code} to proceed.' },
  registered_ok: { hi: 'पंजीकरण सफल', en: 'Registration successful' },
  how_to_continue: { hi: 'आप कैसे आगे बढ़ना चाहेंगे?', en: 'How would you like to continue?' },
  auth_choice_prompt: { hi: 'यदि आप सदस्य हैं तो लॉगिन चुनें, अन्यथा पंजीकरण चुनें', en: 'If you are a member, select Login; otherwise select Register.' },
  login: { hi: 'लॉगिन', en: 'Login' },
  register: { hi: 'पंजीकरण', en: 'Register' },
  // PACS services option labels
  msp: { hi: 'एमएसपी – समर्थन मूल्य', en: 'MSP – Support Price' },
  interest_subvention: { hi: 'ब्याज छूट', en: 'Interest Subvention' },
  janaushadhi: { hi: 'जन औषधि केंद्र', en: 'Jan Aushadhi Kendra' },
  // Helpers
  select_district_first: { hi: 'पहले जिला चुनें', en: 'Select district first' },
  tehsil_list_pending: { hi: 'इस जिले के लिए तहसील सूची जल्द जोड़ी जाएगी', en: 'Tehsil list will be added soon for this district' },
  consent_title: { hi: 'सहमति', en: 'Consent' },
  consent_text: { hi: 'मैं ऐप की शर्तें व गोपनीयता नीति से सहमत हूँ और नीति अनुसार डेटा उपयोग हेतु सहमति देता/देती हूँ।', en: 'I agree to the Terms and Privacy Policy and consent to data use as per policy.' },
  i_agree: { hi: 'मैं सहमत हूँ', en: 'I agree' },
  enter_farmer_id: { hi: 'अपना 16-अंकीय किसान आईडी दर्ज करें', en: 'Enter your 16-digit Farmer ID' },
  fertilizer_items: { hi: 'वस्तु क्रम', en: 'Item list' },
  fertilizer_types: { hi: 'वस्तु प्रकार', en: 'Fertilizer types' },
  enter_quantity: { hi: 'मात्रा दर्ज करें', en: 'Enter quantity' },
  in_kgs: { hi: 'किलो में', en: 'in kg' },
  total_amount: { hi: 'कुल राशि', en: 'Total' },
  add_to_cart: { hi: 'कार्ट में जोड़ें', en: 'Add to cart' },
  not_found_title: { hi: 'ओह!', en: 'Oops!' },
  not_found_message: { hi: 'यह स्क्रीन मौजूद नहीं है।', en: 'This screen does not exist.' },
  go_home: { hi: 'मुख्य पृष्ठ पर जाएँ', en: 'Go to home screen!' },
  home: { hi: 'होम', en: 'Home' },
  explore: { hi: 'एक्सप्लोर', en: 'Explore' },
  // Farmer card labels
  dept_upcb: { hi: 'उत्तर प्रदेश सहकारिता विभाग (UPCB)', en: 'UP Cooperative Dept (UPCB)' },
  farmer_card: { hi: 'सहकार से समृद्धि किसान कार्ड', en: 'Farmer Card' },
  // Fertilizer item names
  fert_urea: { hi: 'यूरिया', en: 'Urea' },
  fert_cut_mark: { hi: 'काटने का निशान', en: 'Cut mark' },
  fert_npk: { hi: 'एनपीके', en: 'NPK' },
  fert_urea_nano: { hi: 'यूरिया नेनो', en: 'Urea Nano' },
  fert_dap_nano: { hi: 'डीएपी नेनो', en: 'DAP Nano' },
  fert_sagarika: { hi: 'सागरिका', en: 'Sagarika' },
  fert_farmion: { hi: 'फार्मियन', en: 'Farmion' },
  fert_beej: { hi: 'बीज', en: 'Seeds' },
  fert_zinc: { hi: 'जिंक', en: 'Zinc' },
  fert_pesticide: { hi: 'कीटनाशक', en: 'Pesticide' },
  fert_to_be_enter: { hi: 'To be enter', en: 'To be enter' },
  // Errors
  err_farmer_id: { hi: 'वैध 16-अंकीय किसान आईडी दर्ज करें', en: 'Enter a valid 16-digit Farmer ID' },
};

function format(str: string, params?: Record<string, string>) {
  if (!params) return str;
  return Object.entries(params).reduce((s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, 'g'), v), str);
}

function mkT(lang: Lang) {
  return (key: keyof typeof strings, fallback?: string, params?: Record<string, string>) =>
    format(strings[key]?.[lang] ?? fallback ?? String(key), params);
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

// Mock data with bilingual labels (Hindi/English) and helpers to localize based on selected language
export type Lang = 'hi' | 'en';

type BiLabel<T extends string = string> = { label: { hi: string; en: string }; value: T };

// Uttar Pradesh districts (75) — bilingual labels
const districtsBi: BiLabel[] = [
  { label: { hi: 'आगरा', en: 'Agra' }, value: 'agra' },
  { label: { hi: 'अलीगढ़', en: 'Aligarh' }, value: 'aligarh' },
  { label: { hi: 'प्रयागराज', en: 'Prayagraj' }, value: 'prayagraj' },
  { label: { hi: 'अम्बेडकर नगर', en: 'Ambedkar Nagar' }, value: 'ambedkar_nagar' },
  { label: { hi: 'अमेठी', en: 'Amethi' }, value: 'amethi' },
  { label: { hi: 'अमरोहा', en: 'Amroha' }, value: 'amroha' },
  { label: { hi: 'औरैया', en: 'Auraiya' }, value: 'auraiya' },
  { label: { hi: 'अयोध्या', en: 'Ayodhya' }, value: 'ayodhya' },
  { label: { hi: 'आज़मगढ़', en: 'Azamgarh' }, value: 'azamgarh' },
  { label: { hi: 'बागपत', en: 'Baghpat' }, value: 'baghpat' },
  { label: { hi: 'बहराइच', en: 'Bahraich' }, value: 'bahraich' },
  { label: { hi: 'बलिया', en: 'Ballia' }, value: 'ballia' },
  { label: { hi: 'बलरामपुर', en: 'Balrampur' }, value: 'balrampur' },
  { label: { hi: 'बांदा', en: 'Banda' }, value: 'banda' },
  { label: { hi: 'बाराबंकी', en: 'Barabanki' }, value: 'barabanki' },
  { label: { hi: 'बरेली', en: 'Bareilly' }, value: 'bareilly' },
  { label: { hi: 'बस्ती', en: 'Basti' }, value: 'basti' },
  { label: { hi: 'भदोही', en: 'Bhadohi' }, value: 'bhadohi' },
  { label: { hi: 'बिजनौर', en: 'Bijnor' }, value: 'bijnor' },
  { label: { hi: 'बदायूँ', en: 'Budaun' }, value: 'budaun' },
  { label: { hi: 'बुलंदशहर', en: 'Bulandshahr' }, value: 'bulandshahr' },
  { label: { hi: 'चंदौली', en: 'Chandauli' }, value: 'chandauli' },
  { label: { hi: 'चित्रकूट', en: 'Chitrakoot' }, value: 'chitrakoot' },
  { label: { hi: 'देवरिया', en: 'Deoria' }, value: 'deoria' },
  { label: { hi: 'एटा', en: 'Etah' }, value: 'etah' },
  { label: { hi: 'इटावा', en: 'Etawah' }, value: 'etawah' },
  { label: { hi: 'फर्रुखाबाद', en: 'Farrukhabad' }, value: 'farrukhabad' },
  { label: { hi: 'फतेहपुर', en: 'Fatehpur' }, value: 'fatehpur' },
  { label: { hi: 'फ़िरोज़ाबाद', en: 'Firozabad' }, value: 'firozabad' },
  { label: { hi: 'गौतमबुद्ध नगर', en: 'Gautam Buddha Nagar' }, value: 'gautam_buddha_nagar' },
  { label: { hi: 'गाज़ियाबाद', en: 'Ghaziabad' }, value: 'ghaziabad' },
  { label: { hi: 'गाज़ीपुर', en: 'Ghazipur' }, value: 'ghazipur' },
  { label: { hi: 'गोण्डा', en: 'Gonda' }, value: 'gonda' },
  { label: { hi: 'गोरखपुर', en: 'Gorakhpur' }, value: 'gorakhpur' },
  { label: { hi: 'हमीरपुर', en: 'Hamirpur' }, value: 'hamirpur' },
  { label: { hi: 'हापुड़', en: 'Hapur' }, value: 'hapur' },
  { label: { hi: 'हरदोई', en: 'Hardoi' }, value: 'hardoi' },
  { label: { hi: 'हाथरस', en: 'Hathras' }, value: 'hathras' },
  { label: { hi: 'जालौन', en: 'Jalaun' }, value: 'jalaun' },
  { label: { hi: 'जौनपुर', en: 'Jaunpur' }, value: 'jaunpur' },
  { label: { hi: 'झांसी', en: 'Jhansi' }, value: 'jhansi' },
  { label: { hi: 'कन्नौज', en: 'Kannauj' }, value: 'kannauj' },
  { label: { hi: 'कानपुर देहात', en: 'Kanpur Dehat' }, value: 'kanpur_dehat' },
  { label: { hi: 'कानपुर नगर', en: 'Kanpur Nagar' }, value: 'kanpur_nagar' },
  { label: { hi: 'कासगंज', en: 'Kasganj' }, value: 'kasganj' },
  { label: { hi: 'कौशाम्बी', en: 'Kaushambi' }, value: 'kaushambi' },
  { label: { hi: 'कुशीनगर', en: 'Kushinagar' }, value: 'kushinagar' },
  { label: { hi: 'खीरी (लखीमपुर)', en: 'Lakhimpur Kheri' }, value: 'lakhimpur_kheri' },
  { label: { hi: 'ललितपुर', en: 'Lalitpur' }, value: 'lalitpur' },
  { label: { hi: 'लखनऊ', en: 'Lucknow' }, value: 'lucknow' },
  { label: { hi: 'महाराजगंज', en: 'Maharajganj' }, value: 'maharajganj' },
  { label: { hi: 'महोबा', en: 'Mahoba' }, value: 'mahoba' },
  { label: { hi: 'मैनपुरी', en: 'Mainpuri' }, value: 'mainpuri' },
  { label: { hi: 'मथुरा', en: 'Mathura' }, value: 'mathura' },
  { label: { hi: 'मऊ', en: 'Mau' }, value: 'mau' },
  { label: { hi: 'मेरठ', en: 'Meerut' }, value: 'meerut' },
  { label: { hi: 'मिर्ज़ापुर', en: 'Mirzapur' }, value: 'mirzapur' },
  { label: { hi: 'मुरादाबाद', en: 'Moradabad' }, value: 'moradabad' },
  { label: { hi: 'मुज़फ्फरनगर', en: 'Muzaffarnagar' }, value: 'muzaffarnagar' },
  { label: { hi: 'पीलीभीत', en: 'Pilibhit' }, value: 'pilibhit' },
  { label: { hi: 'प्रतापगढ़', en: 'Pratapgarh' }, value: 'pratapgarh' },
  { label: { hi: 'रायबरेली', en: 'Rae Bareli' }, value: 'rae_bareli' },
  { label: { hi: 'रामपुर', en: 'Rampur' }, value: 'rampur' },
  { label: { hi: 'सहारनपुर', en: 'Saharanpur' }, value: 'saharanpur' },
  { label: { hi: 'सम्भल', en: 'Sambhal' }, value: 'sambhal' },
  { label: { hi: 'संत कबीर नगर', en: 'Sant Kabir Nagar' }, value: 'sant_kabir_nagar' },
  { label: { hi: 'शाहजहाँपुर', en: 'Shahjahanpur' }, value: 'shahjahanpur' },
  { label: { hi: 'शामली', en: 'Shamli' }, value: 'shamli' },
  { label: { hi: 'श्रावस्ती', en: 'Shrawasti' }, value: 'shrawasti' },
  { label: { hi: 'सिद्धार्थ नगर', en: 'Siddharthnagar' }, value: 'siddharthnagar' },
  { label: { hi: 'सीतापुर', en: 'Sitapur' }, value: 'sitapur' },
  { label: { hi: 'सोनभद्र', en: 'Sonbhadra' }, value: 'sonbhadra' },
  { label: { hi: 'सुल्तानपुर', en: 'Sultanpur' }, value: 'sultanpur' },
  { label: { hi: 'उन्नाव', en: 'Unnao' }, value: 'unnao' },
  { label: { hi: 'वाराणसी', en: 'Varanasi' }, value: 'varanasi' },
];

// Blocks: load from JSON asset (up-blocks.json). Keys are district value codes above; values are arrays of block names.
// For Hindi, we reuse the same label text if a Hindi transliteration isn't available.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const upBlocks: Record<string, string[]> = require('@/assets/data/up-blocks.json');

const blocksBi: Record<string, BiLabel[]> = Object.fromEntries(
  Object.entries(upBlocks || {}).map(([d, blocks]) => [
    d,
    (blocks || []).map((b) => ({ label: { hi: b, en: b }, value: b as string })),
  ])
);

// Tehsils per district loaded from asset (expandable)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const upTehsils: Record<string, string[]> = require('@/assets/data/up-tehsils.json');

const tehsilsBi: Record<string, BiLabel[]> = Object.fromEntries(
  Object.entries(upTehsils || {}).map(([d, arr]) => [
    d,
    (arr || []).map((t) => ({ label: { hi: t, en: t }, value: t as string })),
  ])
);

// Pincode by district(block) map: district key -> block name -> array of pincodes
// eslint-disable-next-line @typescript-eslint/no-var-requires
const upPincodes: Record<string, Record<string, string[]>> = require('@/assets/data/up-pincodes.json');

const committeesBi: BiLabel[] = [
  { label: { hi: 'प्रातकलना समिति', en: 'Pratkalna Committee' }, value: 'pratkalna' },
  { label: { hi: 'रामपुर समिति', en: 'Rampur Committee' }, value: 'rampur' },
  { label: { hi: 'गदरपुर समिति', en: 'Gadarpur Committee' }, value: 'gadarpur' },
];

const pacsBi: BiLabel[] = [
  { label: { hi: 'काशीपुर नं. 2 प्राथमिक कृषि सह. समिति', en: 'Kashipur No. II Primary Agriculture Society Ltd.' }, value: 'pacs_kashipur_2' },
  { label: { hi: 'डोईवाला प्राथमिक कृषि समिति', en: 'Doiwala Primary Agriculture Society' }, value: 'pacs_doiwala' },
  { label: { hi: 'लक्सर पैक्स', en: 'Laksar PACS' }, value: 'pacs_laksar' },
];

const farmerTypesBi: BiLabel<'agriculture' | 'fisheries' | 'animal'>[] = [
  { label: { hi: 'खेती', en: 'Agriculture' }, value: 'agriculture' },
  { label: { hi: 'मत्स्य पालन', en: 'Fisheries' }, value: 'fisheries' },
  { label: { hi: 'पशु पालन', en: 'Animal Husbandry' }, value: 'animal' },
];

const cropSeasonsBi: BiLabel<'rabi' | 'kharif' | 'dalhan'>[] = [
  { label: { hi: 'रबी', en: 'Rabi' }, value: 'rabi' },
  { label: { hi: 'खरीफ', en: 'Kharif' }, value: 'kharif' },
  { label: { hi: 'दलहन', en: 'Pulses (Dalhan)' }, value: 'dalhan' },
];

const cropTypesBi: BiLabel[] = [
  { label: { hi: 'गेहूँ', en: 'Wheat' }, value: 'wheat' },
  { label: { hi: 'धान', en: 'Paddy' }, value: 'paddy' },
  { label: { hi: 'गन्ना', en: 'Sugarcane' }, value: 'sugarcane' },
  { label: { hi: 'सरसों', en: 'Mustard' }, value: 'mustard' },
  { label: { hi: 'मकई', en: 'Maize' }, value: 'maize' },
  { label: { hi: 'दालें', en: 'Pulses' }, value: 'pulses' },
];

const loanCropsBi: BiLabel[] = [
  { label: { hi: 'गेहूँ', en: 'Wheat' }, value: 'wheat' },
  { label: { hi: 'धान', en: 'Paddy' }, value: 'paddy' },
  { label: { hi: 'गन्ना', en: 'Sugarcane' }, value: 'sugarcane' },
  { label: { hi: 'सब्जियाँ', en: 'Vegetables' }, value: 'vegetables' },
];

const tenuresBi: BiLabel[] = [
  { label: { hi: '6 महीने', en: '6 months' }, value: '6m' },
  { label: { hi: '1 वर्ष', en: '1 year' }, value: '1y' },
  { label: { hi: '2 वर्ष', en: '2 years' }, value: '2y' },
];

function mapLocal<T extends string>(list: BiLabel<T>[], lang: Lang) {
  return list.map((i) => ({ value: i.value, label: i.label[lang] }));
}

export function getDistricts(lang: Lang) { return mapLocal(districtsBi, lang); }
export function getBlocks(lang: Lang, districtValue: string | null | undefined) { return mapLocal(blocksBi[districtValue ?? ''] ?? [], lang); }
export function getCommittees(lang: Lang) { return mapLocal(committeesBi, lang); }
export function getPacsList(lang: Lang) { return mapLocal(pacsBi, lang); }
export function getFarmerTypes(lang: Lang) { return mapLocal(farmerTypesBi, lang); }
export function getCropSeasons(lang: Lang) { return mapLocal(cropSeasonsBi, lang); }
export function getCropTypes(lang: Lang) { return mapLocal(cropTypesBi, lang); }
export function getLoanCrops(lang: Lang) { return mapLocal(loanCropsBi, lang); }
export function getTenures(lang: Lang) { return mapLocal(tenuresBi, lang); }
export function getTehsils(lang: Lang, districtValue: string | null | undefined) { return mapLocal(tehsilsBi[districtValue ?? ''] ?? [], lang); }
export function getPincodeByDistrictBlock(districtValue: string | null | undefined, blockName: string | null | undefined): string | null {
  if (!districtValue || !blockName) return null;
  const byBlock = upPincodes[districtValue];
  if (!byBlock) return null;
  const pins = byBlock[blockName];
  return pins && pins.length > 0 ? pins[0] : null;
}

// --- PACS member directory (mock) ---
export type PacsMemberProfile = {
  name: string;
  father_name?: string;
  district: string; // district value code, e.g., 'agra'
  block: string; // block label, e.g., 'Fatehabad'
  village?: string;
  pincode?: string;
  khasra?: string;
  land_area?: string; // hectares as string
  mobile?: string;
  aadhaar?: string;
  pacs_name?: string; // value code from getPacsList
};

const pacsMembers: Record<string, PacsMemberProfile> = {
  PACS0001: {
    name: 'Vikram Kumar',
    father_name: 'Suresh Kumar',
    district: 'agra',
    block: 'Fatehabad',
    village: 'Rampur',
    khasra: '47892',
    land_area: '1.25',
    mobile: '9876543210',
    pacs_name: 'pacs_kashipur_2',
  },
  PACS0002: {
    name: 'Anil Singh',
    father_name: 'Mahendra Singh',
    district: 'lucknow',
    block: 'Malihabad',
    village: 'Kantha',
    khasra: '12983',
    land_area: '0.80',
    mobile: '9123456789',
    pacs_name: 'pacs_doiwala',
  },
};

export function lookupPacsMember(memberId: string): PacsMemberProfile | null {
  const key = (memberId || '').trim().toUpperCase();
  return pacsMembers[key] || null;
}

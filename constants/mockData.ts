// Mock data with bilingual labels (Hindi/English) and helpers to localize based on selected language
export type Lang = 'hi' | 'en';

type BiLabel<T extends string = string> = { label: { hi: string; en: string }; value: T };

const districtsBi: BiLabel[] = [
  { label: { hi: 'उधम सिंह नगर', en: 'Udham Singh Nagar' }, value: 'usn' },
  { label: { hi: 'देहरादून', en: 'Dehradun' }, value: 'ddn' },
  { label: { hi: 'हरिद्वार', en: 'Haridwar' }, value: 'hdw' },
  { label: { hi: 'नैनीताल', en: 'Nainital' }, value: 'ntl' },
];

const blocksBi: Record<string, BiLabel[]> = {
  usn: [
    { label: { hi: 'काशीपुर', en: 'Kashipur' }, value: 'ksp' },
    { label: { hi: 'रुद्रपुर', en: 'Rudrapur' }, value: 'rdp' },
    { label: { hi: 'किच्छा', en: 'Kichha' }, value: 'kch' },
  ],
  ddn: [
    { label: { hi: 'विकास नगर', en: 'Vikas Nagar' }, value: 'vkn' },
    { label: { hi: 'डोईवाला', en: 'Doiwala' }, value: 'dwl' },
  ],
  hdw: [
    { label: { hi: 'लक्सर', en: 'Laksar' }, value: 'lks' },
    { label: { hi: 'रुड़की', en: 'Roorkee' }, value: 'rke' },
  ],
  ntl: [
    { label: { hi: 'हल्द्वानी', en: 'Haldwani' }, value: 'hdw' },
    { label: { hi: 'रामनगर', en: 'Ramnagar' }, value: 'rmg' },
  ],
};

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

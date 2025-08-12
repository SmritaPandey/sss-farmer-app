// Multicolored agriculture icons from assets folder
export const AgricultureIcons = {
  fertilizer: require('./fertilizer.png'),
  pacs: require('./pacs.png'),
  procurement: require('./procurement.png'),
  schemes: require('./schemes.png'),
  directory: require('./directory.png'),
  certificates: require('./certificate.png'),
  settings: require('./settings.png'),
  profile: require('./profile.png'),
  cart: require('./cart.png'),
  notifications: require('./notifications.png'),
  background: require('./main background.jpg'),
  mainBackground: require('./main background.jpg'),
  upGov: require('./UPGov.jpg'),
  twentyfive: require('./25years.png'),
  user: require('./user.jpg'),
  yogi: require('./yogi adityanath.png'),
  jpsRathore: require('./JPSRathore .png'),
  sahkarSarthi: require('./sahkarsarthi.png'),
} as const;

// Helper function to get icon by name
export const getIcon = (iconName: keyof typeof AgricultureIcons) => {
  return AgricultureIcons[iconName];
};

// Helper function to get the app logo
// App logo removed per requirement

// Helper function to get the background image
export const getBackgroundImage = () => {
  return AgricultureIcons.background;
};

// Helper function to get the main background image
export const getMainBackgroundImage = () => {
  return AgricultureIcons.mainBackground;
};

// Logos used on ID card
export const getUPGovLogo = () => AgricultureIcons.upGov;
export const get25YearsLogo = () => AgricultureIcons.twentyfive;
export const getUserImage = () => AgricultureIcons.user;
export const getYogiImage = () => AgricultureIcons.yogi;
export const getJPSRathoreImage = () => AgricultureIcons.jpsRathore;
export const getSahkarSarthiImage = () => AgricultureIcons.sahkarSarthi;

// Helper functions for cart and notification icons
export const getCartIcon = () => {
  return AgricultureIcons.cart;
};

export const getNotificationIcon = () => {
  return AgricultureIcons.notifications;
};

// For backward compatibility and additional icons not in the main set
export const createPlaceholderIcon = (emoji: string, size = 64) => {
  // This is a fallback for icons not yet added to the main set
  return { uri: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><text y="50%" x="50%" text-anchor="middle" dominant-baseline="central" font-size="${size * 0.7}">${emoji}</text></svg>` };
};

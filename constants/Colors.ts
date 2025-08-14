/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Brand: Orange/White with Indian flag accents (green)
// Updated to match logo orange exactly
const saffron = '#FF9933';
const indiaGreen = '#138808';
const tintColorLight = saffron;
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Brand = {
  saffron,
  green: indiaGreen,
  white: '#ffffff',
  // Derived variants to keep shade consistent everywhere
  saffronSurface: 'rgba(255, 153, 51, 0.08)', // soft backgrounds
  saffronDisabled: 'rgba(255, 153, 51, 0.45)', // disabled buttons (transparent)
  saffronDisabledSolid: '#FFCD9F', // disabled buttons (no opacity)
  saffronBorder: 'rgba(255, 153, 51, 0.25)', // subtle borders
};

// Agriculture-friendly supporting palette
export const Palette = {
  leafLight: '#EAF8F0',
  sunLight: '#FFF7E6',
  skyLight: '#E9F5FF',
  outlineLeaf: '#E5F0EB',
  outlineSun: '#FFE4CC',
  soil: '#8B5E3C',
};

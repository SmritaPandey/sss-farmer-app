// Simple API base URL config to avoid hardcoding localhost across screens
// Adjust BASE_URL per environment (device/emulator/production)
// For Android emulator, you might use http://10.0.2.2:4000; for iOS simulator, http://localhost:4000
export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export const api = {
  url: (path: string) => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
};

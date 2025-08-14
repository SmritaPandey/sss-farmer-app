// Formatting helpers

/**
 * Mask an Aadhaar number for display: keep only the last 4 digits visible.
 * Example: 123456789012 -> •••• •••• 9012
 */
export function maskAadhaar(input?: string | null, maskChar = '•'): string {
  if (!input) return '';
  const digits = String(input).replace(/\D/g, '');
  if (!digits) return '';
  const last4 = digits.slice(-4);
  const maskedPrefix = maskChar.repeat(Math.max(0, digits.length - 4));
  const grouped = (maskedPrefix + last4).replace(/(.{4})/g, '$1 ').trim();
  return grouped;
}

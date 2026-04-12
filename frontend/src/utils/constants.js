// Vendor Roles
export const ROLES = {
  SUPER_VENDOR: 'SuperVendor',
  REGIONAL_VENDOR: 'RegionalVendor',
  CITY_VENDOR: 'CityVendor',
  LOCAL_VENDOR: 'LocalVendor',
};

// Cab Fuel Types
export const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric'];

// Document Types
export const DOC_TYPES = ['DL', 'RC', 'Permit', 'Pollution', 'Insurance'];

// Notification Types
export const NOTIFICATION_TYPES = ['ALERT', 'SYSTEM', 'DOCUMENT', 'PAYMENT'];

// Status Badge Colors (Tailwind classes)
export const STATUS_COLORS = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  inactive: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
  blocked: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  verified: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  expired: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

// Role Labels for Display
export const ROLE_LABELS = {
  SuperVendor: 'Super Vendor',
  RegionalVendor: 'Regional Vendor',
  CityVendor: 'City Vendor',
  LocalVendor: 'Local Vendor',
};

// Role hierarchy for registration dropdown
export const ROLE_OPTIONS = [
  { value: 'RegionalVendor', label: 'Regional Vendor' },
  { value: 'CityVendor', label: 'City Vendor' },
  { value: 'LocalVendor', label: 'Local Vendor' },
];

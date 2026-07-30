export type ThemeId =
  | 'cloud'
  | 'emerald'
  | 'purple'
  | 'peach'
  | 'rose'
  | 'aqua'
  | 'yellow'
  | 'coffee';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  feel: string;
  primary: string; // main accent hex
  primaryHover: string;
  lightBg: string;
  sentBubble: string;
  sentBubbleText: string;
  receivedBubble: string;
  receivedBubbleText: string;
  appBg: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cloud: {
    id: 'cloud',
    name: 'Cloud Chat',
    tagline: 'Sky Blue Theme',
    feel: 'Clean, friendly & trustworthy',
    primary: '#2196F3',
    primaryHover: '#1E88E5',
    lightBg: '#E3F2FD',
    sentBubble: '#D7EEFF',
    sentBubbleText: '#0D47A1',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#172B4D',
    appBg: '#F5FAFF',
    textColor: '#172B4D',
    badgeBg: '#E3F2FD',
    badgeText: '#1976D2',
  },
  emerald: {
    id: 'emerald',
    name: 'WhatsApp Classic',
    tagline: 'Emerald Green',
    feel: 'Classic, familiar & highly responsive',
    primary: '#059669',
    primaryHover: '#047857',
    lightBg: '#E8F5E9',
    sentBubble: '#DCF8C6',
    sentBubbleText: '#064E3B',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#111B21',
    appBg: '#F0F2F5',
    textColor: '#111B21',
    badgeBg: '#D1FAE5',
    badgeText: '#047857',
  },
  purple: {
    id: 'purple',
    name: 'Purple Bloom',
    tagline: 'Lavender Theme',
    feel: 'Premium, soft & stylish',
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    lightBg: '#EDE9FE',
    sentBubble: '#E9D5FF',
    sentBubbleText: '#4C1D95',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#2E2347',
    appBg: '#FAF8FF',
    textColor: '#2E2347',
    badgeBg: '#EDE9FE',
    badgeText: '#6D28D9',
  },
  peach: {
    id: 'peach',
    name: 'Peach Talk',
    tagline: 'Peach Theme',
    feel: 'Warm, friendly & welcoming',
    primary: '#F97316',
    primaryHover: '#EA580C',
    lightBg: '#FFEDD5',
    sentBubble: '#FFE0C2',
    sentBubbleText: '#7C2D12',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#3D2B1F',
    appBg: '#FFF9F5',
    textColor: '#3D2B1F',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
  },
  rose: {
    id: 'rose',
    name: 'Rose Chat',
    tagline: 'Rose Theme',
    feel: 'Cute, modern & expressive',
    primary: '#E11D48',
    primaryHover: '#BE123C',
    lightBg: '#FFE4E6',
    sentBubble: '#FFD6DC',
    sentBubbleText: '#881337',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#3F1D2E',
    appBg: '#FFF7F8',
    textColor: '#3F1D2E',
    badgeBg: '#FFE4E6',
    badgeText: '#BE123C',
  },
  aqua: {
    id: 'aqua',
    name: 'Aqua Connect',
    tagline: 'Aqua Theme',
    feel: 'Fresh, calm & clean',
    primary: '#0891B2',
    primaryHover: '#0E7490',
    lightBg: '#CFFAFE',
    sentBubble: '#C8F1F5',
    sentBubbleText: '#164E63',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#164E63',
    appBg: '#F2FCFC',
    textColor: '#164E63',
    badgeBg: '#CFFAFE',
    badgeText: '#0E7490',
  },
  yellow: {
    id: 'yellow',
    name: 'Sunny Chat',
    tagline: 'Yellow Theme',
    feel: 'Cheerful & energetic',
    primary: '#D97706',
    primaryHover: '#B45309',
    lightBg: '#FEF3C7',
    sentBubble: '#FFF0B3',
    sentBubbleText: '#78350F',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#422006',
    appBg: '#FFFDF2',
    textColor: '#422006',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
  coffee: {
    id: 'coffee',
    name: 'Coffee Talk',
    tagline: 'Cream & Brown',
    feel: 'Elegant, classy & unique',
    primary: '#8B5E3C',
    primaryHover: '#6F472B',
    lightBg: '#F3E8D8',
    sentBubble: '#EAD8C0',
    sentBubbleText: '#3E2C20',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#3E2C20',
    appBg: '#FAF7F2',
    textColor: '#3E2C20',
    badgeBg: '#F3E8D8',
    badgeText: '#6F472B',
  },
};

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  isCustomJersey?: boolean;
}

// Product form data (for creating/editing)
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  // Custom jersey configuration
  customConfig?: CustomJerseyConfig;
  // Team order configuration
  isTeamOrder?: boolean;
  teamPlayers?: TeamPlayer[];
}

export interface Category {
  id: string;
  name: string;
  image?: string;
}

// Team player entry
export interface TeamPlayer {
  id: string;
  name: string;
  number: string;
  size: string;
}

// Admin-approved logo
export interface ApprovedLogo {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  isPremium?: boolean;
}

// Custom jersey design template
export interface JerseyDesign {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  // How the 3 colors map to the 5 internal zones
  mapping: {
    base: 'primary' | 'accent1' | 'accent2';
    sleeve: 'primary' | 'accent1' | 'accent2';
    yoke: 'primary' | 'accent1' | 'accent2';
    side: 'primary' | 'accent1' | 'accent2';
    collar: 'primary' | 'accent1' | 'accent2';
  };
  pattern?: 'none' | 'mesh' | 'geometric' | 'camo' | 'aerial';
  overlayImage?: string; // Path to a transparent PNG pattern (stars, stripes, etc)
  overlayColor?: 'primary' | 'accent1' | 'accent2';
}

// Custom jersey configuration
export interface CustomJerseyConfig {
  designId: string;
  primaryColor: string;
  accent1Color: string;
  accent2Color: string;
  
  // High-Res Layer Toggles
  showBody: boolean;
  showSleeves: boolean;
  showCollar: boolean;
  showDesign1: boolean;
  showDesign2: boolean;

  // High-Res Layer Colors
  bodyColor: string;
  sleeveColor: string;
  collarColor: string;
  design1Color: string;
  design2Color: string;

  // High-Res Layer Opacities
  bodyOpacity: number;
  sleeveOpacity: number;
  collarOpacity: number;
  design1Opacity: number;
  design2Opacity: number;

  // Patterns (linked to design or manual override)
  patternOpacity: number;
  
  // Custom Overlays (Uploaded by user)
  customTemplateUrl?: string;
  customTemplateColor: 'accent1' | 'accent2';

  // Assets
  logoImage?: string;
  logoPosition: { x: number; y: number };
  logoScale: number;
  
  // Text Elements
  name: string;  
  namePosition: { y: number };
  nameScale: number;
  nameFont: string;
  nameColor: string;
  nameOutlineColor: string;
  nameOutlineWidth: number;

  teamName?: string;
  teamNamePosition: { y: number };
  teamNameScale: number;
  teamNameOutlineColor: string;

  number: string;
  numberPosition: { y: number };
  numberScale: number;
  numberFont: string;
  numberColor: string;
  numberColorOutline?: string; // New: unified outline support
  numberOutlineColor: string;
  numberOutlineWidth: number;
  numberType: 'front' | 'back' | 'both';

  // State
  useTeamNames?: boolean;

  // Front Text Options
  frontText?: string;
  frontTextPosition?: { x: number, y: number };
  frontTextScale?: number;
  frontTextColor?: string;
  frontTextFont?: string;
  frontTextArc?: 'none' | 'up' | 'down';
}

export const JERSEY_DESIGNS: JerseyDesign[] = [
  {
    id: 'modular-crew',
    name: 'Modular Crew',
    description: 'Fully customizable high-res component system.',
    mapping: {
      base: 'primary',
      sleeve: 'primary',
      yoke: 'primary',
      side: 'primary',
      collar: 'primary'
    }
  }
];

export const JERSEY_COLORS = [
  { name: 'Black', value: '#1a1a1a' },
  { name: 'White', value: '#f5f5f5' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Royal Blue', value: '#0047ab' },
  { name: 'Sky Blue', value: '#87ceeb' },
  { name: 'Red', value: '#c41e3a' },
  { name: 'Maroon', value: '#800000' },
  { name: 'Forest Green', value: '#228b22' },
  { name: 'Kelly Green', value: '#4cbb17' },
  { name: 'Neon Green', value: '#39ff14' },
  { name: 'Purple', value: '#6b3fa0' },
  { name: 'Gold', value: '#ffd700' },
  { name: 'Orange', value: '#ff6b35' },
  { name: 'Pink', value: '#ff69b4' },
  { name: 'Silver', value: '#c0c0c0' },
  { name: 'Charcoal', value: '#36454f' },
  { name: 'Cream', value: '#fffdd0' },
  { name: 'Teal', value: '#008080' },
  { name: 'Sand', value: '#c2b280' },
  { name: 'Burnt Orange', value: '#bf5700' },
];

export const JERSEY_FONTS = [
  { name: 'Bold Standard', value: 'Arial Black, sans-serif' },
  { name: 'Athletic Block', value: 'Impact, sans-serif' },
  { name: 'Vintage', value: 'Georgia, serif' },
  { name: 'Futuristic', value: 'Montserrat, sans-serif' },
  { name: 'Graffiti', value: 'Permanent Marker, cursive' },
  { name: 'Modern Sans', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Sticker', value: 'Luckiest Guy, cursive' },
  { name: 'Pro Varsity', value: 'Copperplate, serif' },
  { name: 'Cyber', value: 'Orbitron, sans-serif' },
];

export const JERSEY_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

// Admin-approved logos
export const APPROVED_LOGOS: ApprovedLogo[] = [
  {
    id: 'logo-0',
    name: '8TWO Classic',
    imageUrl: '/logos/8Two.png',
    category: 'brand',
  },
  {
    id: 'logo-1',
    name: '8TWO Logo',
    imageUrl: '/logos/8twologo.jpg',
    category: 'brand',
  },
  {
    id: 'logo-2',
    name: '8TWO Wordmark',
    imageUrl: '/logos/8two-wordmark.svg',
    category: 'brand',
  },
  {
    id: 'logo-3',
    name: '8TWO Icon',
    imageUrl: '/logos/8two-icon.svg',
    category: 'brand',
  },
  {
    id: 'logo-4',
    name: '8TWO Shield',
    imageUrl: '/logos/8two-shield.svg',
    category: 'brand',
  },
  {
    id: 'logo-5',
    name: '8TWO Stealth',
    imageUrl: '/logos/8two-stealth.png',
    category: 'brand',
  },
  {
    id: 'logo-6',
    name: '8TWO Chrome',
    imageUrl: '/logos/8two-chrome.png',
    category: 'brand',
  },
  {
    id: 'logo-7',
    name: '8TWO Glitch',
    imageUrl: '/logos/8two-glitch.png',
    category: 'brand',
  },
];

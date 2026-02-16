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
}

export const JERSEY_DESIGNS: JerseyDesign[] = [
  {
    id: 'builder-crew-solid',
    name: 'Crew Solid',
    description: 'Clean, professional high-res base using component masking.',
    mapping: {
      base: 'primary',
      sleeve: 'primary',
      yoke: 'primary',
      side: 'primary',
      collar: 'accent1'
    }
  },
  {
    id: 'builder-crew-stripes-h',
    name: 'Crew Horizontal',
    description: 'Classic horizontal stripe patterns across the lower body.',
    mapping: {
      base: 'primary',
      sleeve: 'accent1',
      yoke: 'primary',
      side: 'primary',
      collar: 'accent1'
    },
    overlayImage: '/patterns/Design1_1.png',
    overlayColor: 'accent2'
  },
  {
    id: 'builder-crew-stripes-v',
    name: 'Crew Vanguard',
    description: 'Bold diagonal shoulder stripes for a high-impact athletic look.',
    mapping: {
      base: 'primary',
      sleeve: 'primary',
      yoke: 'primary',
      side: 'primary',
      collar: 'accent2'
    },
    overlayImage: '/patterns/Design1_2.png',
    overlayColor: 'accent1'
  },
  {
    id: 'builder-crew-full',
    name: 'Crew Pro Elite',
    description: 'Multi-tone component layout with integrated graphic overlays.',
    mapping: {
      base: 'primary',
      sleeve: 'accent1',
      yoke: 'primary',
      side: 'primary',
      collar: 'accent2'
    },
    overlayImage: '/patterns/Design1_1.png',
    overlayColor: 'accent2'
  }
];

export const JERSEY_COLORS = [
  { name: 'Black', value: '#1a1a1a' },
  { name: 'White', value: '#f5f5f5' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Red', value: '#c41e3a' },
  { name: 'Forest Green', value: '#228b22' },
  { name: 'Royal Blue', value: '#4169e1' },
  { name: 'Purple', value: '#6b3fa0' },
  { name: 'Gold', value: '#ffd700' },
  { name: 'Orange', value: '#ff6b35' },
  { name: 'Pink', value: '#ff69b4' },
];

export const JERSEY_FONTS = [
  { name: 'Bold Standard', value: 'Arial Black, sans-serif' },
  { name: 'Athletic', value: 'Impact, sans-serif' },
  { name: 'Classic', value: 'Georgia, serif' },
  { name: 'Modern', value: 'Montserrat, sans-serif' },
  { name: 'Street', value: 'Permanent Marker, cursive' },
  { name: 'Clean', value: 'Helvetica, Arial, sans-serif' },
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
];

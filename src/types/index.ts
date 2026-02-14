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
  numberOutlineColor: string;
  numberOutlineWidth: number;
  numberType: 'front' | 'back' | 'both';

  // State
  useTeamNames?: boolean;
}

export const JERSEY_DESIGNS: JerseyDesign[] = [
  {
    id: 'classic',
    name: 'Classic Solid',
    description: 'Clean, professional single-tone base with subtle accents.',
    mapping: {
      base: 'primary',
      sleeve: 'primary',
      yoke: 'primary',
      side: 'primary',
      collar: 'accent1'
    }
  },
  {
    id: 'aerial',
    name: 'Aerial Elite',
    description: 'Angular speed panels with high-contrast shoulder yokes.',
    pattern: 'aerial',
    mapping: {
      base: 'primary',
      sleeve: 'accent1',
      yoke: 'accent2',
      side: 'accent1',
      collar: 'accent2'
    }
  },
  {
    id: 'striker',
    name: 'Striker Vertical',
    description: 'Aggressive vertical side inserts for a slim, athletic look.',
    mapping: {
      base: 'primary',
      sleeve: 'primary',
      yoke: 'primary',
      side: 'accent1',
      collar: 'accent1'
    }
  },
  {
    id: 'stealth',
    name: 'Stealth Camo',
    description: 'Subdued digital patterns across the main body panels.',
    pattern: 'camo',
    mapping: {
      base: 'primary',
      sleeve: 'accent1',
      yoke: 'primary',
      side: 'accent1',
      collar: 'accent1'
    }
  },
  {
    id: 'velocity',
    name: 'Velocity Mesh',
    description: 'Technical hexagon mesh panels for high-performance aesthetic.',
    pattern: 'mesh',
    mapping: {
      base: 'primary',
      sleeve: 'accent2',
      yoke: 'primary',
      side: 'accent2',
      collar: 'accent1'
    }
  },
  {
    id: '8two-elite',
    name: '8TWO Elite X1',
    description: 'The flagship design. Complex paneling with high-contrast tactical accents.',
    mapping: {
      base: 'primary',
      sleeve: 'accent1',
      yoke: 'accent1',
      side: 'accent2',
      collar: 'accent2'
    }
  },
  {
    id: 'deuce-legacy',
    name: 'Deuce Legacy',
    description: 'Traditional athletic silhouette with modernized shoulder paneling.',
    mapping: {
      base: 'primary',
      sleeve: 'primary',
      yoke: 'accent2',
      side: 'primary',
      collar: 'accent1'
    }
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

// Admin-approved logos (in production, this would come from a database/CMS)
export const APPROVED_LOGOS: ApprovedLogo[] = [
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
    name: 'Premier Sports',
    imageUrl: '/logos/premier-sports.svg',
    category: 'partner',
  },
  {
    id: 'logo-6',
    name: 'Athletic Club',
    imageUrl: '/logos/athletic-club.svg',
    category: 'partner',
  },
  {
    id: 'logo-7',
    name: 'Youth League',
    imageUrl: '/logos/youth-league.svg',
    category: 'league',
  },
];

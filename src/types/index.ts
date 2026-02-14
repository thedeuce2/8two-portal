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

// Custom jersey configuration
export interface CustomJerseyConfig {
  baseColor: string;
  trimColor: string;
  logoImage?: string;
  logoPosition: { x: number; y: number };
  logoScale: number;
  // Shared design (for team orders)
  name: string;  
  namePosition: { y: number };
  nameScale: number;
  teamName?: string;
  teamNamePosition: { y: number };
  teamNameScale: number;
  nameFont: string;
  nameColor: string;
  number: string;
  numberPosition: { y: number };
  numberScale: number;
  numberFont: string;
  numberColor: string;
  numberType: 'front' | 'back' | 'both';
  // For team orders, players override shared name/number
  useTeamNames?: boolean;
}

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

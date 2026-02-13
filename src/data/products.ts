import { Product, Category } from '@/types';

export const categories: Category[] = [
  { id: 'jerseys', name: 'JERSEYS' },
  { id: 'hoodies', name: 'HOODIES' },
  { id: 'jackets', name: 'JACKETS' },
  { id: 'pants', name: 'PANTS' },
  { id: 'accessories', name: 'ACCESSORIES' },
];

// Bulk shipping discounts
export const BULK_DISCOUNTS = [
  { minItems: 20, discount: 0.25, label: '25% off shipping' },
  { minItems: 10, discount: 0.15, label: '15% off shipping' },
  { minItems: 5, discount: 0.10, label: '10% off shipping' },
];

// Base shipping cost
export const BASE_SHIPPING = 9.99;

export const products: Product[] = [
  {
    id: 'custom-jersey',
    name: '8TWO CUSTOM JERSEY',
    description: 'Fully customized jersey with your choice of colors, logo, name, and number. Premium quality materials with professional stitching.',
    price: 54.99,
    category: 'jerseys',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    inStock: true,
    isCustomJersey: true,
  },
  {
    id: '1',
    name: '8TWO PREMIUM JERSEY',
    description: 'Heavyweight cotton jersey with spray paint graphic. Made for those who demand comfort and style.',
    price: 49.99,
    category: 'jerseys',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
  },
  {
    id: '2',
    name: 'URBAN HOODIE',
    description: 'Premium fleece hoodie with oversized 8TWO logo. Perfect for the streets.',
    price: 79.99,
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    inStock: true,
  },
  {
    id: '3',
    name: 'STREET BOMBER JACKET',
    description: 'Lightweight bomber jacket with water-resistant coating. Urban protection meets style.',
    price: 129.99,
    category: 'jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '4',
    name: 'CARGO PANTS',
    description: 'Durable cargo pants with multiple pockets. Built for functionality.',
    price: 69.99,
    category: 'pants',
    sizes: ['28', '30', '32', '34', '36', '38'],
    inStock: true,
  },
  {
    id: '5',
    name: 'LOGO SNAPBACK',
    description: 'Classic snapback cap with 8TWO embroidery. One size fits most.',
    price: 29.99,
    category: 'accessories',
    inStock: true,
  },
  {
    id: '6',
    name: 'TECH TEE',
    description: 'Performance tech tee with moisture-wicking fabric. For the active lifestyle.',
    price: 34.99,
    category: 'jerseys',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '7',
    name: 'PUFFER JACKET',
    description: 'Insulated puffer jacket for cold weather. Lightweight warmth.',
    price: 159.99,
    category: 'jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: false,
  },
  {
    id: '8',
    name: 'BUCKET HAT',
    description: 'Functional bucket hat with embroidered logo. Sun protection with style.',
    price: 24.99,
    category: 'accessories',
    inStock: true,
  },
];

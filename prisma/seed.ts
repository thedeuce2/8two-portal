import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@test.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('test', 12);
    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin',
        password: hashedPassword,
        isAdmin: true,
      },
    });
    console.log('✅ Created admin user: admin@test.com / test');
  } else {
    // Update existing user to be admin
    await prisma.user.update({
      where: { email: 'admin@test.com' },
      data: { isAdmin: true },
    });
    console.log('✅ Admin user updated: admin@test.com');
  }

  // Create demo teams
  const teams = [
    {
      name: 'Thunder Basketball',
      slug: 'thunder-basketball',
      code: 'THUNDER25',
      description: 'Official team store for Thunder Basketball Club',
      colors: JSON.stringify(['#FFD700', '#1e3a5f']),
      logo: '/logos/8twologo.jpg',
    },
    {
      name: 'Riverside Soccer',
      slug: 'riverside-soccer',
      code: 'RIVER25',
      description: 'Riverside Soccer Club merchandise',
      colors: JSON.stringify(['#228b22', '#ffffff']),
      logo: '/logos/8twologo.jpg',
    },
    {
      name: 'Metro Hockey',
      slug: 'metro-hockey',
      code: 'METRO25',
      description: 'Metro Hockey Association team store',
      colors: JSON.stringify(['#c41e3a', '#1a1a1a']),
      logo: '/logos/8twologo.jpg',
    },
  ];

  for (const team of teams) {
    const existing = await prisma.team.findUnique({
      where: { code: team.code },
    });

    if (!existing) {
      await prisma.team.create({ data: team });
      console.log(`✅ Created team: ${team.name} (code: ${team.code})`);
    } else {
      console.log(`⏭️  Team already exists: ${team.name}`);
    }
  }

  // Create initial products
  const products = [
    {
      id: 'custom-jersey',
      name: '8TWO CUSTOM JERSEY',
      description: 'Fully customized jersey with your choice of colors, logo, name, and number.',
      price: 54.99,
      category: 'jerseys',
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
      colors: ['Black', 'White', 'Navy', 'Red'],
      inStock: true,
    },
    {
      name: '8TWO PREMIUM JERSEY',
      description: 'Heavyweight cotton jersey with spray paint graphic.',
      price: 49.99,
      category: 'jerseys',
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: ['Black', 'White'],
      inStock: true,
    }
  ];

  for (const product of products) {
    const existing = await prisma.product.findUnique({
      where: { id: product.id || 'none' },
    });

    if (!existing) {
      await prisma.product.create({ data: product });
      console.log(`✅ Created product: ${product.name}`);
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

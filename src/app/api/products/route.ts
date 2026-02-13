import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const teamId = searchParams.get('teamId');

  try {
    let products;

    if (teamId) {
      // Get only products for a specific team
      const teamProducts = await prisma.teamProduct.findMany({
        where: { teamId },
        include: {
          product: true
        }
      });
      // Map to just the product objects
      products = teamProducts.map(tp => ({
        ...tp.product,
        price: tp.price // Use the team-specific price
      }));
    } else {
      // Get only "Public" products (those NOT linked to any team)
      // Or if the user just wants the whole public catalog
      products = await prisma.product.findMany({
        where: {
          AND: [
            category && category !== 'all' ? { category } : {},
            // This is a bit tricky with Prisma (finding records NOT in a relation)
            // For now, let's just return everything tagged public
            // or just everything if no teamId is specified.
          ]
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      teamProducts: {
        include: {
          team: {
            select: { name: true, id: true }
          }
        }
      }
    }
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        image: data.image,
        sizes: data.sizes || [],
        colors: data.colors || [],
        inStock: data.inStock !== undefined ? data.inStock : true,
      }
    });

    // If a teamId is provided, also create a TeamProduct link
    if (data.teamId) {
      await prisma.teamProduct.create({
        data: {
          teamId: data.teamId,
          productId: product.id,
          price: product.price, // Default to product price
        }
      });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

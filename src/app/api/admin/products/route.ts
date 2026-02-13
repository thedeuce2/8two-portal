import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { ProductFormData } from '@/types';

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;
  
  if (!authToken) return null;
  
  const [userId] = Buffer.from(authToken, 'base64').toString('utf-8').split(':');
  return userId || null;
}

async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });
  return user?.isAdmin || false;
}

// GET - List all products
export async function GET() {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    const data: ProductFormData = await req.json();

    // Validate required fields
    if (!data.name || !data.description || !data.category) {
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
        sizes: data.sizes || [],
        colors: data.colors || [],
        inStock: data.inStock,
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

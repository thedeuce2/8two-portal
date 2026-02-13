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

// PUT - Update product
export async function PUT(req: Request) {
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

    const { id, ...data }: ProductFormData & { id: string } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
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
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(req: Request) {
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

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

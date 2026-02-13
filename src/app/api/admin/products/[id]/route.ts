import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const data = await req.json();
    
    // Update the base product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price !== undefined ? parseFloat(data.price) : undefined,
        category: data.category,
        image: data.image,
        sizes: data.sizes,
        colors: data.colors,
        inStock: data.inStock,
      }
    });

    // Handle Team association
    if (data.teamId !== undefined) {
      // Remove existing team link first (simple way to "change" or "unset" team)
      await prisma.teamProduct.deleteMany({
        where: { productId: id }
      });

      // If a new teamId is provided, link it
      if (data.teamId) {
        await prisma.teamProduct.create({
          data: {
            teamId: data.teamId,
            productId: id,
            price: product.price
          }
        });
      }
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    // Delete team products first (or let cascade handle if configured)
    await prisma.teamProduct.deleteMany({
      where: { productId: id }
    });

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

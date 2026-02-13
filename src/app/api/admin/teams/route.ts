import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const teams = await prisma.team.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { members: true, products: true }
      }
    }
  });

  return NextResponse.json({ teams });
}

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const team = await prisma.team.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        code: data.code || Math.random().toString(36).substring(2, 8).toUpperCase(),
        description: data.description,
        logo: data.logo,
        colors: JSON.stringify(data.colors || []),
      }
    });

    return NextResponse.json({ team });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;
  
  if (!authToken) return null;
  
  const [userId] = Buffer.from(authToken, 'base64').toString('utf-8').split(':');
  return userId || null;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Team code is required' },
        { status: 400 }
      );
    }

    // Find team by code
    const team = await prisma.team.findUnique({
      where: { code },
    });

    if (!team) {
      return NextResponse.json(
        { error: 'Invalid team code' },
        { status: 400 }
      );
    }

    // Check if already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: team.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'Already a member of this team' },
        { status: 400 }
      );
    }

    // Add as team member
    await prisma.teamMember.create({
      data: {
        userId,
        teamId: team.id,
        role: 'member',
      },
    });

    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        logo: team.logo,
      },
    });
  } catch (error) {
    console.error('Team join error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ teams: [] });
    }

    const memberships = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: true,
      },
    });

    return NextResponse.json({
      teams: memberships.map((m) => ({
        id: m.team.id,
        name: m.team.name,
        slug: m.team.slug,
        logo: m.team.logo,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    });
  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

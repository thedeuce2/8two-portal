import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { products } from '@/data/products';
import TeamShopClient from './TeamShopClient';

interface TeamShopPageProps {
  params: Promise<{ slug: string }>;
}

// Server component - fetches team data
export default async function TeamShopPage({ params }: TeamShopPageProps) {
  const { slug } = await params;

  // Fetch team from database
  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      members: {
        select: { userId: true },
      },
    },
  });

  if (!team) {
    notFound();
  }

  // Parse team colors
  let teamColors: string[] = [];
  try {
    teamColors = team.colors ? JSON.parse(team.colors) : ['#ffffff', '#000000'];
  } catch {
    teamColors = ['#ffffff', '#000000'];
  }

  // Get all products (in production, this would filter by team products)
  const allProducts = products.filter(p => p.inStock);

  return (
    <TeamShopClient
      team={{
        id: team.id,
        name: team.name,
        slug: team.slug,
        description: team.description,
        logo: team.logo,
        colors: teamColors,
        memberCount: team.members.length,
      }}
      products={allProducts}
    />
  );
}

// Generate static params for known teams (optional)
export async function generateStaticParams() {
  const teams = await prisma.team.findMany({
    select: { slug: true },
  });
  return teams.map((team) => ({ slug: team.slug }));
}

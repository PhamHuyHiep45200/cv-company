import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Find the current job post to get its category_id
    const currentJob = await prisma.jobPost.findUnique({
      where: { id: params.id },
      select: { category_id: true },
    });
    if (!currentJob) {
      return NextResponse.json([], { status: 200 });
    }
    // Find 5 other jobs with the same category_id, excluding the current job
    const relatedJobs = await prisma.jobPost.findMany({
      where: {
        category_id: currentJob.category_id,
        id: { not: params.id },
      },
      orderBy: { created_at: 'desc' },
      take: 5,
      include: {
        category: true,
        level: true,
      },
    });
    return NextResponse.json(relatedJobs);
  } catch (error) {
    console.error('Error fetching related jobs:', error);
    return NextResponse.json([], { status: 500 });
  }
} 
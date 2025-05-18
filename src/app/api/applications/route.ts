import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(req: any) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '5', 10);

    const where: any = {};
    if (status) where.status = status;
    if (email || name) {
      where.user = {};
      if (email) where.user.email = { contains: email, mode: 'insensitive' };
      if (name) where.user.name = { contains: name, mode: 'insensitive' };
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          user: true,
          job_post: {
            include: {
              level: { select: { name: true } },
              category: { select: { name: true } },
            },
          },
        },
        orderBy: {
          applied_at: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.application.count({ where }),
    ]);

    const result = applications.map(app => ({
      ...app,
      job_post: {
        id: app.job_post.id,
        title: app.job_post.title,
        created_at: app.job_post.created_at,
        level: app.job_post.level,
        category: app.job_post.category,
      },
    }));
    return NextResponse.json({ data: result, total });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
} 
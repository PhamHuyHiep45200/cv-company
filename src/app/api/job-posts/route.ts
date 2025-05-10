import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.jobPost.count();

    const jobPosts = await prisma.jobPost.findMany({
      include: {
        category: true,
        level: true,
        posted_by: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: jobPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching job posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const jobPost = await prisma.jobPost.create({
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        benefits: body.benefits,
        salary: body.salary,
        location: body.location,
        experience: body.experience,
        status: body.status || 'OPEN',
        deadline: new Date(body.deadline),
        category: {
          connect: { id: body.category_id },
        },
        level: {
          connect: { id: body.level_id },
        },
        posted_by: {
          connect: { id: body.posted_by_id },
        },
      },
    });

    return NextResponse.json(jobPost);
  } catch (error) {
    console.error('Error creating job post:', error);
    return NextResponse.json(
      { error: 'Failed to create job post' },
      { status: 500 }
    );
  }
} 
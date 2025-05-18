import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobPost = await prisma.jobPost.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            thumbnail: true,
          },
        },
        level: {
          select: {
            id: true,
            name: true,
          },
        },
        posted_by: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!jobPost) {
      return NextResponse.json(
        { error: 'Job post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(jobPost);
  } catch (error) {
    console.error('Error fetching job post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      requirements,
      benefits,
      salary,
      location,
      experience,
      deadline,
      status,
      category_id,
      level_id,
      posted_by_id,
    } = body;

    // Get existing job post to check current deadline
    const existingJobPost = await prisma.jobPost.findUnique({
      where: { id: params.id },
    });

    if (!existingJobPost) {
      return NextResponse.json(
        { error: 'Job post not found' },
        { status: 404 }
      );
    }

    const jobPost = await prisma.jobPost.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        requirements,
        benefits,
        salary,
        location,
        experience,
        deadline: deadline ? new Date(deadline) : existingJobPost.deadline,
        status,
        category_id,
        level_id,
        posted_by_id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            thumbnail: true,
          },
        },
        level: {
          select: {
            id: true,
            name: true,
          },
        },
        posted_by: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(jobPost);
  } catch (error) {
    console.error('Error updating job post:', error);
    return NextResponse.json(
      { error: 'Failed to update job post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.jobPost.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Job post deleted successfully' });
  } catch (error) {
    console.error('Error deleting job post:', error);
    return NextResponse.json(
      { error: 'Failed to delete job post' },
      { status: 500 }
    );
  }
} 
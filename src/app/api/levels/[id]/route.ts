import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Level name is required' },
        { status: 400 }
      );
    }

    // Check if level exists
    const existingLevel = await prisma.level.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingLevel) {
      return NextResponse.json(
        { error: 'Level not found' },
        { status: 404 }
      );
    }

    // Check if another level with same name exists
    const duplicateLevel = await prisma.level.findFirst({
      where: {
        name: body.name,
        id: {
          not: params.id,
        },
      },
    });

    if (duplicateLevel) {
      return NextResponse.json(
        { error: 'Level with this name already exists' },
        { status: 400 }
      );
    }

    // Update level
    const updatedLevel = await prisma.level.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(updatedLevel);
  } catch (error) {
    console.error('Error updating level:', error);
    return NextResponse.json(
      { error: 'Failed to update level' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if level exists
    const existingLevel = await prisma.level.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingLevel) {
      return NextResponse.json(
        { error: 'Level not found' },
        { status: 404 }
      );
    }

    // Delete level
    await prisma.level.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: 'Level deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting level:', error);
    return NextResponse.json(
      { error: 'Failed to delete level' },
      { status: 500 }
    );
  }
} 
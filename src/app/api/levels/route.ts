import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const levels = await prisma.level.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Ensure we always return an array
    return NextResponse.json(levels || []);
  } catch (error) {
    console.error('Error fetching levels:', error);
    // Return empty array instead of error object
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Level name is required and must be a string' },
        { status: 400 }
      );
    }

    // Trim and validate name
    const trimmedName = body.name.trim();
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: 'Level name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check if level with same name already exists
    const existingLevel = await prisma.level.findUnique({
      where: {
        name: trimmedName,
      },
    });

    if (existingLevel) {
      return NextResponse.json(
        { error: 'Level with this name already exists' },
        { status: 400 }
      );
    }

    // Create new level
    const level = await prisma.level.create({
      data: {
        name: trimmedName,
      },
    });

    return NextResponse.json(level, { status: 201 });
  } catch (error) {
    console.error('Error creating level:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A level with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred while creating the level' },
      { status: 500 }
    );
  }
} 
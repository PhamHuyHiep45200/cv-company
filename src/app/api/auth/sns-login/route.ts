import { NextResponse } from 'next/server';
import { generateToken } from '@/utils/jwt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { email, name, avatar } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        name: true,
        phone: true,
        password: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      // Set default name if not provided
      if (!name) {
        name = email.split('@')[0];
      }
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: undefined,
          role: 'CANDIDATE', // Default role for SNS login
          status: 'ACTIVE',
          avatar: avatar || null,
        },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          name: true,
          phone: true,
          password: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    // user is guaranteed to exist here
    const u = user!;
    const token = await generateToken({
      email: u.email,
      role: u.role,
      id: u.id,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: u.id,
        email: u.email,
        role: u.role,
        status: u.status,
      },
      token,
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 100000,
    });

    return response;
  } catch (error) {
    console.error('SNS Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi SNS login' },
      { status: 500 }
    );
  }
} 
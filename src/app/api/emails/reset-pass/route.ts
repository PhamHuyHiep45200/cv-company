import { Resend } from 'resend';
import { EmailTemplate } from '@/components/template/email-template';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const resend = new Resend(process.env.RESEND_API_KEY);
const prisma = new PrismaClient();

function generateRandomPassword(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: 'Email là bắt buộc.' }, { status: 400 });
    }
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);
    if (!user) {
      return Response.json({ error: 'Email không tồn tại trong hệ thống.' }, { status: 404 });
    }
    // Generate new password
    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update password in DB
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Your Name <onboarding@resend.dev>',
      to: [email],
      subject: 'Đặt lại mật khẩu tài khoản CV Company',
      react: EmailTemplate({ firstName: user.name || user.email, newPassword }),
    });
    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
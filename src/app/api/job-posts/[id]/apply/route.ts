import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const coverLetter = formData.get('coverLetter');
  const cv = formData.get('cv'); // This is a Blob-like object

  if (!cv || typeof (cv as any).arrayBuffer !== 'function') {
    return NextResponse.json({ success: false, error: 'Vui lòng tải lên file CV (.csv, .pdf)' }, { status: 400 });
  }

  const fileName = (cv as any).name || 'cv';
  const fileType = (cv as any).type || '';
  const allowedTypes = ['application/pdf', 'text/csv'];
  if (!allowedTypes.includes(fileType)) {
    return NextResponse.json({ success: false, error: 'Chỉ chấp nhận file .csv hoặc .pdf' }, { status: 400 });
  }

  // Save file to /public/applications/[jobId]/
  const jobId = params.id;
  const uploadDir = path.resolve(process.cwd(), 'public', 'applications', jobId);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const filePath = path.join(uploadDir, fileName);
  const arrayBuffer = await (cv as any).arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath, buffer);
  const cvFilePath = `/applications/${jobId}/${fileName}`;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email: String(email) } });
  if (!user) {
    return NextResponse.json({ success: false, error: 'Không tìm thấy người dùng với email này.' }, { status: 404 });
  }

  // Save application to database
  const application = await prisma.application.create({
    data: {
      user_id: user.id,
      job_post_id: jobId,
      cv_file: cvFilePath,
      cover_letter: String(coverLetter),
      // status and applied_at are set by default
    },
  });

  return NextResponse.json({
    success: true,
    jobId,
    name,
    email,
    coverLetter,
    cvName: fileName,
    filePath: cvFilePath,
    application,
    message: 'Ứng tuyển thành công!'
  });
} 
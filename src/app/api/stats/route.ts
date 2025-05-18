import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Number of users grouped by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    // 2. Number of job postings
    const jobPostingsCount = await prisma.jobPost.count();

    // 3. Number of candidates grouped by job position (job_post)
    const candidatesByJob = await prisma.application.groupBy({
      by: ['job_post_id'],
      _count: { job_post_id: true },
    });
    // Get job post titles for mapping
    const jobPostIds = candidatesByJob.map(j => j.job_post_id);
    const jobPosts = await prisma.jobPost.findMany({
      where: { id: { in: jobPostIds } },
      select: { id: true, title: true },
    });
    const jobTitleMap = Object.fromEntries(jobPosts.map(j => [j.id, j.title]));
    const candidatesByJobWithTitle = candidatesByJob.map(j => ({
      job_post_id: j.job_post_id,
      job_title: jobTitleMap[j.job_post_id] || '',
      count: j._count.job_post_id,
    }));

    // 4. Number of job applications submitted, grouped by week, month, year
    const applications = await prisma.application.findMany({
      select: { applied_at: true },
    });
    const now = new Date();
    const weekStats: Record<string, number> = {};
    const monthStats: Record<string, number> = {};
    const yearStats: Record<string, number> = {};
    for (const app of applications) {
      const date = new Date(app.applied_at);
      // Week: year-weekNumber
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      const weekKey = `${year}-W${week}`;
      weekStats[weekKey] = (weekStats[weekKey] || 0) + 1;
      // Month: year-month
      const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthStats[monthKey] = (monthStats[monthKey] || 0) + 1;
      // Year
      yearStats[year] = (yearStats[year] || 0) + 1;
    }

    return NextResponse.json({
      usersByRole,
      jobPostingsCount,
      candidatesByJob: candidatesByJobWithTitle,
      applicationsByWeek: weekStats,
      applicationsByMonth: monthStats,
      applicationsByYear: yearStats,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

// Helper to get ISO week number
function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1)/7);
} 
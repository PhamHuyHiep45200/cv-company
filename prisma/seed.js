const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    },
  },
});

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      name: 'Admin User',
      phone: '0123456789',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      avatar: null,
    },
  });

  // Create employee user
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'employee@company.com' },
    update: {},
    create: {
      email: 'employee@company.com',
      name: 'Employee User',
      phone: '0987654321',
      password: employeePassword,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      avatar: null,
    },
  });

  console.log({ admin, employee });

  await prisma.categoryJob.createMany({
    data: [
      { name: 'IT', thumbnail: '/uploads/it.png' },
      { name: 'Marketing', thumbnail: '/uploads/marketing.png' },
      { name: 'Finance', thumbnail: '/uploads/finance.png' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
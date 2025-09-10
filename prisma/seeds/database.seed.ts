import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = bcrypt.hashSync('123456', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      email: 'admin@example.com',
      name: 'Admin',
      password: password,
      YOB: 1990,
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: password,
      YOB: 1990,
    },
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

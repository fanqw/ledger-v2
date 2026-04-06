import bcrypt from 'bcryptjs';
import { prisma } from '../lib/db/prisma';

async function main() {
  const username = process.env.DEFAULT_ADMIN_USERNAME ?? 'admin';
  const password = process.env.DEFAULT_ADMIN_PASSWORD ?? 'admin123456';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      deletedAt: null,
    },
    create: {
      username,
      passwordHash,
      role: 'ADMIN',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

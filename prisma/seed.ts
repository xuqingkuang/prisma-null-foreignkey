// Feed the initial data
// https://www.prisma.io/docs/guides/application-lifecycle/seed-database

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  prisma.author.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      name: 'Hemingway'
    },
  });
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

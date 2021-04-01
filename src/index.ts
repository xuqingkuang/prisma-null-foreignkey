import { prisma, PrismaClient} from '@prisma/client';

const prismaClient = new PrismaClient({
  log: ['warn', 'error'],
});

function log(message, ...args) {
  console.log('='.repeat(10), message, '='.repeat(10));
  args.forEach(arg => console.log(arg));
};

(async () => {
  // Clean the book table
  await prismaClient.$executeRaw('DELETE FROM Book');
  await prismaClient.$executeRaw('UPDATE sqlite_sequence SET seq = 0 WHERE name = "Book"');

  // Insert a book with raw sql will be OK
  {
    await prismaClient.$executeRaw('INSERT INTO Book (title, authorId) VALUES ("The Old Man and the Sea", NULL)');
    const books = await prismaClient.book.findMany({
      include: {
        author: true,
      },
    });
    log('One books should exist ', books);
  }

  // Insert a book with create method will be OK
  {
    await prismaClient.book.create({
      data: {
        title: 'A Farewell to Arms',
        authorId: null,
      },
    });
    const books = await prismaClient.book.findMany({
      include: {
        author: true,
      },
    });
    log('Two books should exist ', books);
  }

  // ISSUE 1: Insert a book with upsert method will throw a error.
  //        Error message: Argument authorId: Got invalid value null on prisma.upsertOneBook. Provided null, expected Int.
  {
    const title = 'For Whom the Bell Tolls';
    try {
      await prismaClient.book.upsert({
        where: {
          title_authorId: {
            title,
            authorId: null,
          },
        },
        update: {},
        create: {
          title,
          authorId: null,
        },
      });

    } catch(err) {
      log('Prisma.upsert with null error:', err.constructor.name, err.message, err.stack);
    }
  }

  // ISSUE 2: Specfic the foreign key will throw anther foreign key constraint error.
  {
    try {
      const title = 'For Whom the Bell Tolls';
      await prismaClient.book.upsert({
        where: {
          title_authorId: {
            title,
            authorId: 0,
          },
        },
        update: {},
        create: {
          title,
          authorId: 0,
        },
      });
    } catch(err) {
      log('Prisma.upsert with non-exists foreign got foreign key constraint error', err.constructor.name, err.message, err.stack);
    }
  }

  process.exit();
})();

# Prisma with null foreign key

The project shows a bug of [upsert](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference/#upsert),  when input a null as argument to upsert, Prisma will throw a error and can't handle it.

## Usage

1. Clone the project: `git clone https://github.com/xuqingkuang/prisma-null-foreignkey.git`
2. Install the dependencies: `npm i`
3. Start the program: `npm start`

The result will be output to stdout, and the reproducible code is locate at [./src/index.ts#L40](./src/index.ts#L40).

## Output

```
❯ npm start

> prisma-null-foreignkey@1.0.0 start
> ts-node ./src/index.ts

========== One books should exist  ==========
[
  {
    id: 1,
    title: 'The Old Man and the Sea',
    authorId: null,
    author: null
  }
]
========== Two books should exist  ==========
[
  {
    id: 1,
    title: 'The Old Man and the Sea',
    authorId: null,
    author: null
  },
  { id: 2, title: 'A Farewell to Arms', authorId: null, author: null }
]
========== Prisma.upsert with null error: ==========
PrismaClientValidationError

Invalid `prisma.book.upsert()` invocation:

{
  where: {
    title_authorId: {
      title: 'For Whom the Bell Tolls',
      authorId: null
                ~~~~
    }
  },
  update: {},
  create: {
    title: 'For Whom the Bell Tolls',
    authorId: null
  }
}

Argument authorId: Got invalid value null on prisma.upsertOneBook. Provided null, expected Int.


Error: 
Invalid `prisma.book.upsert()` invocation:

{
  where: {
    title_authorId: {
      title: 'For Whom the Bell Tolls',
      authorId: null
                ~~~~
    }
  },
  update: {},
  create: {
    title: 'For Whom the Bell Tolls',
    authorId: null
  }
}

Argument authorId: Got invalid value null on prisma.upsertOneBook. Provided null, expected Int.


    at Document.validate (/home/xqkuang/github/prisma-null-foreignkey/node_modules/@prisma/client/runtime/index.js:32548:19)
    at NewPrismaClient._executeRequest (/home/xqkuang/github/prisma-null-foreignkey/node_modules/@prisma/client/runtime/index.js:34481:17)
    at /home/xqkuang/github/prisma-null-foreignkey/node_modules/@prisma/client/runtime/index.js:34416:52
    at AsyncResource.runInAsyncScope (async_hooks.js:197:9)
    at NewPrismaClient._request (/home/xqkuang/github/prisma-null-foreignkey/node_modules/@prisma/client/runtime/index.js:34416:25)
    at Object.then (/home/xqkuang/github/prisma-null-foreignkey/node_modules/@prisma/client/runtime/index.js:34536:39)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
========== Prisma.upsert with non-exists foreign got foreign key constraint error ==========
PrismaClientKnownRequestError2

Invalid `prisma.book.upsert()` invocation:


  Foreign key constraint failed on the field: `foreign key`
Error: 
Invalid `prisma.book.upsert()` invocation:


  Foreign key constraint failed on the field: `foreign key`
    at cb (/home/xqkuang/github/prisma-null-foreignkey/node_modules/@prisma/client/runtime/index.js:34862:17)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
```
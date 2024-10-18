
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request: Request) {

  await prisma.todo.deleteMany()


  await prisma.todo.createMany({
    data: [
      {
        description: 'Learn how to use Next.js with Prisma',

      },
      {
        description: 'Create a new project using Next.js and Prisma',

      },
      {
        description: 'Deploy the project to Vercel',
        complete: true
      },
      {
        description: 'Celebrate your new project!',
      }
    ]
  })


  return NextResponse.json({
    message: 'Hello from the seed route!'
  })
}
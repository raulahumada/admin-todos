
import { NextResponse } from 'next/server';
import * as yup from 'yup';
import prisma from '../../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const take = Number(searchParams.get('take') ?? 10) // Default to 10 if no query param is passed
  const skip = Number(searchParams.get('skip') ?? 0) // Default to 0 if no query param is passed

  if (isNaN(take) || isNaN(skip)) {
    return NextResponse.json({
      error: 'Invalid query parameters'
    }, { status: 400 })
  }

  const todos = await prisma.todo.findMany(
    {
      skip: skip,
      take: take,
    }
  )

  return NextResponse.json(todos)
}


const postSchema = yup.object({
  description: yup.string().required(),
  complete: yup.boolean().optional().default(false),
})

export async function POST(request: Request) {

  try {


    const body = await postSchema.validate(await request.json())

    const todo = await prisma.todo.create({ data: body })
    return NextResponse.json(todo)
  } catch (error) {
    return NextResponse.json(error, { status: 400 })
  }
}
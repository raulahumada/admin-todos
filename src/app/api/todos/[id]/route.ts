import { Todo } from '@prisma/client';
import { NextResponse } from 'next/server';
import * as yup from 'yup';
import prisma from '../../../../../lib/prisma';
interface Segments {
  params: {
    id: string;
  }
}


const getTodo = async (id: string): Promise<Todo | null> => {

  const todo = await prisma.todo.findUnique({
    where: {
      id: id,
    }
  })

  return todo
}


export async function GET(request: Request,
  { params }: Segments
) {

  const todoUnique = await getTodo(params.id)

  if (!todoUnique) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  return NextResponse.json(todoUnique);
}

const yupSchema = yup.object({
  description: yup.string().required(),
  complete: yup.boolean().optional().default(false),
});

export async function PUT(request: Request,
  { params }: Segments
) {

  try {


    const { complete, description } = await yupSchema.validate(await request.json())

    const todoUnique = await getTodo(params.id)

    if (!todoUnique) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }


    const todo = await prisma.todo.update({
      where: {
        id: params.id,
      },
      data: { complete, description },
    });

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });

  }
}
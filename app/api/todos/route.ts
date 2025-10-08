import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Todo from '@/models/Todo';

export async function GET() {
  await connectDB();
  const todos = await Todo.find().sort({ createdAt: -1 });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  await connectDB();
  const { title } = await req.json();
  const newTodo = await Todo.create({ title });
  return NextResponse.json(newTodo, { status: 201 });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Todo.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}

export async function PATCH(req: Request) {
  await connectDB();
  const { id, completed } = await req.json();
  const todo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
  return NextResponse.json(todo);
}

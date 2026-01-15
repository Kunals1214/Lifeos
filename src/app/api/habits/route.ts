import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const habits = await api.habits.list();
    return NextResponse.json(habits);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newHabit = {
      id: uuidv4(),
      ...body,
    };
    await api.habits.add(newHabit);
    return NextResponse.json(newHabit);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add habit' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing habit ID' }, { status: 400 });
    }

    await api.habits.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
  }
}

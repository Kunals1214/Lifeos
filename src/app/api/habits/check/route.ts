import { NextResponse } from 'next/server';
import { api } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { habitId, date, completed } = await request.json();
    
    if (completed) {
      await api.habits.log(habitId, date);
    } else {
      await api.habits.unlog(habitId, date);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update habit status' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const envPassword = process.env.APP_PASSWORD;
  
  // Debug logging (remove in production)
  console.log('Input password length:', password?.length);
  console.log('Env password length:', envPassword?.length);
  console.log('Input trimmed:', JSON.stringify(password?.trim()));
  console.log('Env trimmed:', JSON.stringify(envPassword?.trim()));
  console.log('Match:', password?.trim() === envPassword?.trim());
  
  // Trim and compare passwords (handle potential whitespace/newlines in env)
  if (password && envPassword && password.trim() === envPassword.trim()) {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'waitlist.json');

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const fileData = await fs.readFile(DATA_PATH, 'utf-8');
    const waitlist = JSON.parse(fileData);

    if (waitlist.find((u: any) => u.email === email)) {
      return NextResponse.json({ message: 'Already on the waitlist!' }, { status: 200 });
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      name: name || '',
      joinedAt: new Date().toISOString(),
    };

    waitlist.push(newUser);
    await fs.writeFile(DATA_PATH, JSON.stringify(waitlist, null, 2));

    return NextResponse.json({ message: 'Welcome to the waitlist!' }, { status: 201 });
  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authCookie = req.cookies.get('admin_session');
    
    // Simple mock auth check
    if (authCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileData = await fs.readFile(DATA_PATH, 'utf-8');
    const waitlist = JSON.parse(fileData);

    return NextResponse.json(waitlist);
  } catch (error) {
    console.error('Waitlist Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

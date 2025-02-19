import { NextResponse } from 'next/server';
import { ensureAdminAccount } from '@/lib/mongodb';

export async function GET() {
  try {
    await ensureAdminAccount();
    return NextResponse.json({ message: 'Admin account initialized successfully' });
  } catch (error) {
    console.error('Failed to initialize admin account:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin account' },
      { status: 500 }
    );
  }
} 
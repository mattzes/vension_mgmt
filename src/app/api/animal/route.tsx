import { NextResponse } from 'next/server';
import { animals } from '@/mocked_general_data';

export async function GET() {
  return NextResponse.json(animals);
}

import { NextResponse } from 'next/server';
import { freezers } from '@/mocked_general_data';

export async function GET() {
  return NextResponse.json(freezers);
}

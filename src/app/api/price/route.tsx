import { NextRequest, NextResponse } from 'next/server';
import { prices } from '@/mocked_general_data';

export async function GET() {
  return NextResponse.json(prices);
}

export async function POST(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 202 });
}

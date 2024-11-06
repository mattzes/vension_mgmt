import { NextRequest, NextResponse } from 'next/server';
import { freezers_only } from '@/mocked_general_data';

export async function POST(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 202 });
}

export async function DELETE(req: NextRequest) {
  console.log(await req.json());
  return NextResponse.json({ message: 'success' }, { status: 204 });
}

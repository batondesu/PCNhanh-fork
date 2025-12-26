export const fetchCache = "force-no-store"
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Lấy chi tiết yêu cầu lắp đặt
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestData = await prisma.installationRequest.findUnique({
      where: { id },
    });

    if (!requestData) {
      return NextResponse.json(
        { error: 'Installation request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(requestData);
  } catch (error) {
    console.error('Error fetching installation request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch installation request' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật trạng thái yêu cầu lắp đặt
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const requestData = await prisma.installationRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(requestData);
  } catch (error) {
    console.error('Error updating installation request:', error);
    return NextResponse.json(
      { error: 'Failed to update installation request' },
      { status: 500 }
    );
  }
}


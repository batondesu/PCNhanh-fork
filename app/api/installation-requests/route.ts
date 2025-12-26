export const fetchCache = "force-no-store"
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// POST - Tạo yêu cầu lắp đặt mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      address,
      note,
      preferredDate,
      preferredTime,
      components, // Build components JSON
      totalPrice,
    } = body;

    // Validation
    if (!name || !phone || !address || !components || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const installationRequest = await prisma.installationRequest.create({
      data: {
        name,
        phone,
        email: email || null,
        address,
        note: note || null,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        components: components as any, // JSON type
        totalPrice: parseInt(totalPrice),
        status: 'pending',
      },
    });

    return NextResponse.json(installationRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating installation request:', error);
    return NextResponse.json(
      { error: 'Failed to create installation request' },
      { status: 500 }
    );
  }
}

// GET - Lấy danh sách yêu cầu lắp đặt (cho admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const requests = await prisma.installationRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching installation requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch installation requests' },
      { status: 500 }
    );
  }
}


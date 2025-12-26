import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST - Tạo đơn hàng mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      address,
      note,
      paymentMethod = 'cod',
      items, // Array of { productId, quantity, price }
      totalPrice,
    } = body;

    // Validation
    if (!name || !phone || !address || !items || items.length === 0 || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Tạo order và order items trong transaction
    const order = await prisma.$transaction(async (tx) => {
      // Tạo order
      const newOrder = await tx.order.create({
        data: {
          name,
          phone,
          email: email || null,
          address,
          note: note || null,
          paymentMethod,
          totalPrice: parseInt(totalPrice),
          status: 'pending',
        },
      });

      // Tạo order items
      const orderItems = await Promise.all(
        items.map((item: { productId: string; quantity: number; price: number | string }) =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: typeof item.price === 'string' ? parseInt(item.price) : item.price,
            },
          })
        )
      );

      return {
        ...newOrder,
        items: orderItems,
      };
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET - Lấy danh sách đơn hàng (cho admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}


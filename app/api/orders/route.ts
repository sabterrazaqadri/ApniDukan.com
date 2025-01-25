import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, orderItems, totalAmount } = body;

    // Create a unique order ID
    const orderId = uuidv4().slice(0, 8).toUpperCase();

    const order = {
      _type: 'order',
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      orderItems: orderItems.map((item: any) => ({
        _type: 'orderItem',
        product: {
          _type: 'reference',
          _ref: item.product._id
        },
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      status: 'pending',
      orderDate: new Date().toISOString()
    };

    // Save the order to Sanity
    const response = await client.create(order);

    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      message: 'Order placed successfully' 
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

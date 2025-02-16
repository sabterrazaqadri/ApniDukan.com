/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import client from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, orderItems, totalAmount } = await req.json();

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !orderItems || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a unique order ID
    const orderId = uuidv4().slice(0, 8).toUpperCase();

    // Log incoming data for debugging
    console.log('Creating order with items:', JSON.stringify(orderItems, null, 2));

    const orderDoc = {
      _type: "order",
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      orderItems: orderItems.map((item: any) => {
        if (!item.product?._id) {
          console.error('Missing product ID for item:', item);
          throw new Error('Invalid product data in order items');
        }
        return {
          _key: uuidv4(),
          _type: "object",
          product: {
            _type: "reference",
            _ref: item.product._id
          },
          quantity: item.quantity || 1
        };
      }),
      totalAmount,
      status: "pending",
      orderDate: new Date().toISOString(),
    };

    // Log the final order document
    console.log('Final order document:', JSON.stringify(orderDoc, null, 2));

    // Save the order to Sanity
    const response = await client.create(orderDoc);

    return NextResponse.json({
      success: true,
      orderId: orderId,
      message: "Order placed successfully",
      order: response,
      redirect: "/success",
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to create order: ${error.message}` 
      },
      { status: 500 }
    );
  }
}

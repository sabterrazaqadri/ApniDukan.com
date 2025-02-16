import { defineType, defineField } from "sanity";
import { v4 as uuidv4 } from "uuid"; // Generate unique _key values

export const order = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
    }),
    defineField({
      name: "customerPhone",
      title: "Customer Phone",
      type: "string",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "text",
    }),
    defineField({
      name: "orderItems",
      title: "Order Items",
      type: "array",
      of: [{
        type: "object",
        name: "orderItem",
        fields: [
          {
            name: "product",
            title: "Product",
            type: "reference",
            to: [{ type: "product" }],
          },
          {
            name: "quantity",
            title: "Quantity",
            type: "number",
          }
        ],
        preview: {
          select: {
            title: 'product.name',
            quantity: 'quantity',
          },
          prepare(selection) {
            const {title, quantity} = selection
            return {
              title: title,
              subtitle: `Quantity: ${quantity}`
            }
          }
        }
      }]
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
    }),
  ],
});
